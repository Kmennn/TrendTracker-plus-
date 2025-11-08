import librosa
import numpy as np
import argparse
import json

def extract_audio_features(audio_path):
    try:
        y, sr = librosa.load(audio_path)

        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        rmse = librosa.feature.rms(y=y)
        energy = np.mean(rmse)

        # A simple heuristic for danceability
        beat_strength = np.mean(librosa.onset.onset_detect(y=y, sr=sr))
        danceability = np.clip((beat_strength * tempo) / 200, 0, 1) # Normalize to 0-1 range

        features = {
            "tempo": tempo.tolist() if isinstance(tempo, np.ndarray) else tempo,
            "energy": energy.tolist() if isinstance(energy, np.ndarray) else energy,
            "danceability": danceability
        }
        
        print(json.dumps(features, indent=4))

    except Exception as e:
        print(f"Error processing audio file: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Extract audio features from an audio file.')
    parser.add_argument('audio_path', help='Path to the audio file.')
    args = parser.parse_args()
    extract_audio_features(args.audio_path)