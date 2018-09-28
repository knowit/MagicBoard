#!/usr/bin/env python
# coding: utf-8
"""MMM-Facial-Recognition-OCV3 - MagicMirror Module
The MIT License (MIT)

Copyright (c) 2018 Mathieu Goulène (MIT License)
Based on work by Paul-Vincent Roll (Copyright 2016) (MIT License)
"""
import cv2  # OpenCV Library
from lib.common.face import FaceDetection
from lib.tools.config import ToolsConfig
import time
import os
import signal
import sys

model = ToolsConfig.model()
face = ToolsConfig.getFaceAndEyesDetection()
camera = ToolsConfig.getCamera()

print('Loading training data...')
model.read("training.xml")
print('Training data loaded!')


def clean_shutdown(signum, frame):
    """Release camera and close windows
    """
    camera.stop()
    cv2.destroyAllWindows()
    sys.exit(0)


signal.signal(signal.SIGINT, clean_shutdown)
signal.signal(signal.SIGTERM, clean_shutdown)
signal.signal(signal.SIGSEGV, clean_shutdown)

# Loadking the training data should give enough time to
# warm up the picamera. If not, uncomment the following
# line
# time.sleep(1)

while True:
    # camera video feed
    frame = camera.read()

    image = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)

    faces = face.detect_faces(image)

    if faces is not None:
        for i in range(0, len(faces)):
            if faces[i] is None:
                print("Bad face object None")
                continue
            if len(faces[i]) != 4:
                print("Bad face object {0}".format(faces[i]))
                continue
            x, y, w, h = faces[i]
            # x and y coordinates of the face
            x_face = x
            y_face = y
            crop = face.crop(image, x, y, w, h,int(ToolsConfig.getFaceFactor() * w))
			
			# confidence the lower the stronger the match
			
            label, confidence = model.predict(crop)

            match = "None"
            match = "None"
            label_str = "None"
            if (label != -1 and label != 0):
                label_str = ToolsConfig.userLabel(label)
            print(confidence)
            # the closer confidence is to zer the stronger the match
            if confidence < 0.6 * ToolsConfig.POSITIVE_THRESHOLD:
                label_str = 'Strong:' + label_str
            elif confidence < ToolsConfig.POSITIVE_THRESHOLD:
                label_str = 'Weak:' + label_str
            elif confidence < 1.5 * ToolsConfig.POSITIVE_THRESHOLD:
                label_str = "Guess: " + label_str
            else:
                lavel_str = "Unknown"

            print(label_str)

            # face rectable
            cv2.rectangle(frame, (x, y), (x + w, y + h), 255)
            # height
            cv2.putText(frame,
                        str(int(h)),
                        (x + w, y + h + 15),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (255, 255, 255),
                        1)
            # label user
            cv2.putText(frame,
                        label_str,
                        (x - 3, y - 8),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1.5,
                        (255, 255, 255),
                        1)
            # confidence
            cv2.putText(frame,
                        str(int(confidence)),
                        (x - 2, y + h + 15),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (255, 255, 255),
                        1)
            if h > 250:
                # If person is close enough, mark the eyes
                eyes = face.detect_eyes(crop)
                for i in range(0, len(eyes)):
                    x, y, w, h = eyes[i]
                    cv2.rectangle(frame,
                                  (x + x_face, y + y_face - 30),
                                  (x + x_face + w + 10, y + y_face + h - 40),
                                  (94, 255, 0))
                    cv2.putText(frame, "Eye " + str(i),
                                (x + x_face, y + y_face - 5),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                0.5,
                                (255, 255, 255),
                                1)

    if ('DISPLAY' in os.environ):
        # Display Image
        cv2.imshow('Facial recognition', frame)
        if cv2.waitKey(1) == ord('q'):
            break
    else:
        print('No windowing system, writing face.jpg image')
        camera.stop()
        break


clean_shutdown()
