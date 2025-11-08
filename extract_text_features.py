import pandas as pd
import re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation

def clean_text(text):
    text = text.lower()
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text

def analyze_text_features(df):
    df['text'] = df['title'] + ' ' + df['description']
    df['text'] = df['text'].apply(clean_text)

    analyzer = SentimentIntensityAnalyzer()
    df['sentiment_score'] = df['text'].apply(lambda text: analyzer.polarity_scores(text)['compound'])

    vectorizer = TfidfVectorizer(max_df=0.95, min_df=2, stop_words='english')
    X = vectorizer.fit_transform(df['text'])

    lda = LatentDirichletAllocation(n_components=5, random_state=42)
    lda.fit(X)

    topic_mixture = lda.transform(X)
    df['topic'] = topic_mixture.argmax(axis=1)

    return df

if __name__ == "__main__":
    try:
        df = pd.read_csv('youtube_data.csv')
        df_with_features = analyze_text_features(df)
        df_with_features.to_csv('text_features.csv', index=False)
        print("Text features extracted and saved to text_features.csv")
    except FileNotFoundError:
        print("Error: youtube_data.csv not found. Please run youtube_collector.py first.")