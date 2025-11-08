import cv2
import numpy as np
import argparse
import json

def extract_visual_features(video_path):
    # In a real implementation, you would download these files
    # For this example, we'll assume they are in the current directory
    try:
        net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
        layer_names = net.getLayerNames()
        output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
        with open("coco.names", "r") as f:
            classes = [line.strip() for line in f.readlines()]
    except FileNotFoundError:
        print("Error: YOLOv3 model files (yolov3.weights, yolov3.cfg, coco.names) not found.")
        print("Please download them and place them in the same directory as the script.")
        return

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error opening video file")
        return

    total_frames_analyzed = 0
    total_brightness = 0
    object_counts = {}
    frame_rate = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(frame_rate)

    while cap.isOpened():
        frame_id = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
        ret, frame = cap.read()
        if not ret:
            break

        if frame_id % frame_interval == 0:
            total_frames_analyzed += 1
            h, w, _ = frame.shape
            total_brightness += np.mean(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY))

            blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
            net.setInput(blob)
            outs = net.forward(output_layers)

            for out in outs:
                for detection in out:
                    scores = detection[5:]
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]
                    if confidence > 0.5:
                        label = str(classes[class_id])
                        object_counts[label] = object_counts.get(label, 0) + 1

    cap.release()

    if total_frames_analyzed > 0:
        avg_brightness = total_brightness / total_frames_analyzed
    else:
        avg_brightness = 0

    top_5_objects = dict(sorted(object_counts.items(), key=lambda item: item[1], reverse=True)[:5])

    features = {
        "object_counts": top_5_objects,
        "avg_brightness": avg_brightness
    }

    print(json.dumps(features, indent=4))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Extract visual features from a video.')
    parser.add_argument('video_path', help='Path to the video file.')
    args = parser.parse_args()
    extract_visual_features(args.video_path)