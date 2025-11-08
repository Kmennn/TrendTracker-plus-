import argparse
import pandas as pd
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

def youtube_search(api_key, query, max_results=50):
    youtube = build('youtube', 'v3', developerKey=api_key)

    try:
        search_response = youtube.search().list(
            q=query,
            part='id,snippet',
            maxResults=max_results,
            order='relevance',
            type='video'
        ).execute()

        video_ids = [item['id']['videoId'] for item in search_response.get('items', [])]
        
        if not video_ids:
            print("No videos found.")
            return []

        video_details = youtube.videos().list(
            part="snippet,statistics",
            id=",".join(video_ids)
        ).execute()

        videos_data = []
        for item in video_details.get("items", []):
            snippet = item.get("snippet", {})
            statistics = item.get("statistics", {})
            videos_data.append({
                'video_id': item.get('id'),
                'title': snippet.get('title'),
                'description': snippet.get('description'),
                'view_count': statistics.get('viewCount'),
                'like_count': statistics.get('likeCount'),
                'comment_count': statistics.get('commentCount'),
                'publication_date': snippet.get('publishedAt')
            })
        
        return videos_data

    except HttpError as e:
        print(f"An HTTP error {e.resp.status} occurred: {e.content}")
        return None

def main():
    parser = argparse.ArgumentParser(description='Fetch YouTube video data.')
    parser.add_argument('api_key', help='Your YouTube Data API v3 key.')
    parser.add_argument('query', help='The search query for videos.')
    args = parser.parse_args()

    video_data = youtube_search(args.api_key, args.query)

    if video_data:
        df = pd.DataFrame(video_data)
        df.to_csv('youtube_data.csv', index=False)
        print("Data successfully saved to youtube_data.csv")

if __name__ == '__main__':
    main()