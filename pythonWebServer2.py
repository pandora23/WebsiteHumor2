import os.path

import tornado.ioloop
import tornado.httpserver
import tornado.options
import tornado.web

import nltk
from nltk.corpus import wordnet as wn
from nltk.corpus import stopwords, words

from nltk import FreqDist
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.preprocessing import Normalizer
from sklearn import metrics
from sklearn.cluster import KMeans, MiniBatchKMeans
from scipy.stats.stats import pearsonr

import multiprocessing
import time
from itertools import product
import json
import urllib2
import urllib
import re
import csv
import sklearn
import numpy
import signal
import re
from bs4 import BeautifulSoup

from tornado.options import define, options
define("port", default=8416, type=int)

def css_files(self):
    return "style.css"

stopwords = nltk.corpus.stopwords.words('english')
words = nltk.corpus.words.words()
regExp = re.compile('[a-z]*')

allData=object;

class DataPoint:
    def __init__(self):
        self.P1Dat = ""
        self.P2Dat = ""
        self.M1Dat = ""
        self.M2Dat = ""

        self.counts = []
        self.freqs = []
        
        self.freqP1 = {}
        self.freqP2 = {}
        self.freqM1 = {}
        self.freqM2 = {}
        
class Data:

    def __init__(self):
        self.count = 0;
        self.instances = list();
        
    def setNewData(self):
        dp = DataPoint()
        self.instances.append(dp)
        
        
def signal_handler(signum, frame):
    print(signum)
    tornado.ioloop.IOLoop.instance().stop()

signal.signal(signal.SIGINT, signal_handler)


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('page.html')


def pageGrab(url, whichList, A, idN, initialized, self, distance):
    accepted = False
    try:
        if('www.youtube.com' not in url):
            if(url.startswith("http") is not True):
                url = "http://"+url
            print(url)
            page = urllib2.urlopen(url, timeout=10).read()
            accepted = True
        #return page, True
    except:
        print('not accepted')
        accepted = False
        
    if(accepted==True):	
	
        print('accepted')
        accepted = True
        soup = BeautifulSoup(page)
        page = soup.get_text()
            
        page = re.sub('[;:.,`\"\'-]','',page)
        page = page.lower();
            #tokenize
        page = nltk.word_tokenize(page)
        
        #GRAB CO-OCCURING WORDS
        #find indexes of A
        indexList = []
        i = 0
        try:
            while True:
                i = page.index(A.lower(), i)
                indexList.append(i)
                i = i+1;
                print("i")
        except:
            pass

        
        #distance to target
        distanceFromTarget = distance
        pageTokens=[]
        returnTokens=[]
    
        try:
            for index in indexList:
                if index < distanceFromTarget:
                    returnTokens.extend(page[:(index+distanceFromTarget)])
                elif (index + distanceFromTarget) >= len(page):
                    returnTokens.extend(page[(index-distanceFromTarget):index])
                else:
                    returnTokens.extend(page[(index-distanceFromTarget):(index+distanceFromTarget)])
        except:
            pass

        returnString = ""                      
        returnString = " ".join(returnTokens)
        
        print("id: "+str(idN))
        if(whichList == "P1"):
            allData.instances[idN].P1Dat = allData.instances[idN].P1Dat + " " + returnString;
        elif(whichList == "P2"):
            allData.instances[idN].P2Dat = allData.instances[idN].P2Dat + " " + returnString;
        elif(whichList == "M1"):
            allData.instances[idN].M1Dat = allData.instances[idN].M1Dat + " " + returnString;
        elif(whichList == "M2"):
            allData.instances[idN].M2Dat = allData.instances[idN].M2Dat + " " + returnString;
            
        
        returnPacket = {'texts':returnString,'which':whichList, 'idNum':idN, 'initialized':initialized}
        print(returnPacket)
        self.write(returnPacket)
        self.finish()
        
    else:
        print('failed')
        returnPacket = {'texts':"",'which':"fail", 'idNum':idN, 'initialized':initialized }
        self.write(returnPacket)
        self.finish()

class WebSiteGrabberHandler(tornado.web.RequestHandler):
    def post(self):

        #on first grab establishes a new Dataset for the user, and the id to return

        dataInitialized = self.get_argument('dataInitialized')
        
        print(type(dataInitialized))

        if dataInitialized == "false":
            idN = allData.count;
            allData.setNewData();
            dataInitialized = True;
            allData.count = allData.count + 1
            print("numInstances " + str(len(allData.instances)))
        else:
            idN = self.get_argument('idNum');
            idN= int(idN)
            
        #grab url, convert from unicode to string
        url = str(self.get_argument('texts'))
        
        
        whichList = self.get_argument('which')
        A = self.get_argument('AmbiguousWord')
        distance = self.get_argument('dist')
        
        p = multiprocessing.Process(target=pageGrab(url, whichList, A, idN, dataInitialized, self, int(distance)))

        
        
        

class Initializer(tornado.web.RequestHandler):
    def get(self):
        #idNum = self.get_argument('idNum')
        idN = allData.count;
        allData.setNewData();
        dataInitialized = True;
        allData.count = allData.count + 1
        returnPacket = {'idNum':idN, 'initialized':dataInitialized}
        self.write(returnPacket)
        self.finish()
        
class FrequencyFinder(tornado.web.RequestHandler):
    def post(self):
        
        idNumber = self.get_argument('idNum')
        ambWord = self.get_argument('ambiguous')
        ngWidth = self.get_argument('ngWidth')
        
        idNumber = int(idNumber)
        ngWidth = int(ngWidth)
        
        
        bigramVectorizer = CountVectorizer(stop_words = 'english', ngram_range=(1,ngWidth), token_pattern=r'\b\w+\b',min_df=1, max_features = 500);
        
        transformed = bigramVectorizer.fit_transform([allData.instances[idNumber].P1Dat,allData.instances[idNumber].P2Dat,
                                                      allData.instances[idNumber].M1Dat,allData.instances[idNumber].M2Dat])
        
        tags = bigramVectorizer.get_feature_names()
    
        countsToReturn = []
        freqsToReturn = []

        #just the frequency scores sorted
        f=[]

        #tf-idf
        tf_transformer = TfidfTransformer(use_idf=True).fit(transformed)
        tf = tf_transformer.transform(transformed)
        

        #establish counts
        for doc in transformed:
            doc = doc.toarray()
            counts = {}
            
            for word, count in zip(tags,doc[0]):
                
                counts.update({word:int(count)})
            counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)
            countsToReturn.append(counts)

        #establish frequencies
        for doc in tf:
            doc = doc.toarray()
            freqs = {}
            
            for word, freq in zip(tags,doc[0]):
                if(word != ambWord):
                    freqs.update({word:float(freq)})

            #sort by word and just grab fscore
            f.append([x[1] for x in sorted(freqs.items(), key=lambda x: x[0], reverse=True)])
            
            #sort by score for displaying
            freqs = sorted(freqs.items(), key=lambda x: x[1], reverse=True)
            freqsToReturn.append(freqs)
        
        

        #set data for frequencies and counts
        allData.instances[idNumber].counts = countsToReturn
        allData.instances[idNumber].freqs = freqsToReturn


        #calculate correlations
        
        print(f[0])
        print(f[2])

        c1x = pearsonr(f[0],f[2])
        c1y = pearsonr(f[0],f[3])
        c2x = pearsonr(f[1],f[2])
        c2y = pearsonr(f[1],f[3])

        
        
        
        #return sorted top frequency words   
        returnPacket = {'P1Freq':freqsToReturn[0],'P2Freq':freqsToReturn[1],
                        'M1Freq':freqsToReturn[2],'M2Freq':freqsToReturn[3], 'C1X':{'score':c1x},
                        'C1Y':{'score':c1y},'C2X':{'score':c2x},'C2Y':{'score':c2y}}
        self.write(returnPacket)
        self.finish()

        

        
            


if __name__ == '__main__':
    allData = Data();
    tornado.options.parse_command_line()
    app = tornado.web.Application(
            handlers=[(r'/',IndexHandler), (r'/urlGrab/', WebSiteGrabberHandler),
                      (r'/freqFinder/', FrequencyFinder), (r'/initialize/', Initializer)],
            #template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path = os.path.join(os.path.dirname("__file__"), "static"),
            
        
        )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

