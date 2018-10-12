# coding: utf-8
"""MMM-Facial-Recognition-OCV3 - MagicMirror Module
The MIT License (MIT)

Copyright (c) 2018 Mathieu Goulène (MIT License)
Based on work by Paul-Vincent Roll (Copyright 2016) (MIT License)
"""
from __future__ import division
# need to run `pip install future` for builtins (python 2 & 3 compatibility)
from   builtins import input
from time import sleep

import os
import sys
import re

import cv2
sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))+ '/common/'))

from lib.tools.config import ToolsConfig
from face import FaceDetection

class ToolsCapture:
    def __init__(self, capName=None, captureAmount=12):
        self.face = ToolsConfig.getFaceDetection()
        self.captureName = capName
        self.captureAmount = captureAmount
                     
    def capture(self):
        toolsConfig = ToolsConfig(self.captureName)
        camera = toolsConfig.getCamera()
        print('Capturing positive training images.')
        print('Press enter to capture an image.')
        print('Press Ctrl-C to quit.')
        for x in range(self.captureAmount):
            try:
                print('Capturing image...')
                image = camera.read()
                # Convert image to grayscale.
                image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
                # Get coordinates of single face in captured image.
                result = self.face.detect_single(image)
                if result is None:
                    print('Could not detect single face!'
                          + ' Check the image in capture.pgm'
                          + ' to see what was captured and try'
                          + ' again with only one face visible.')
                    continue
                x, y, w, h = result
                # Crop image as close as possible to desired face aspect ratio.
                # Might be smaller if face is near edge of image.
                crop = self.face.crop(image, x, y, w, h,int(ToolsConfig.getFaceFactor() * w))
                # Save image to file.
                filename, count = toolsConfig.getNewCaptureFile()
                cv2.imwrite(filename, crop)
                sleep(0.5) #sleep for half a second
                print('Found face and wrote training image', filename)
            except KeyboardInterrupt:
                camera.stop()
                break

