"""Raspberry Pi Face Recognition Treasure Box
Pi Camera OpenCV Capture Device
Copyright 2013 Tony DiCola

Pi camera device capture class for OpenCV.  This class allows you to capture a
single image from the pi camera as an OpenCV image.
"""
import io
import cv2
import numpy as np
import picamera
import threading

from threading import Thread

class OpenCVCapture(Thread):
    def __init__(self, preview=False):
        Thread.__init__(self)
        self.buffer = io.BytesIO()
        self.lock = threading.Lock()
        self.running = True
        self.preview = preview

    def run(self):
        with picamera.PiCamera() as camera:
            camera.resolution = (620, 540)
            if self.preview:
                camera.start_preview(fullscreen=False, window = (100, 20, 620, 540))
            stream = io.BytesIO()
            for stream in camera.capture_continuous(stream, format='jpeg', use_video_port=True):
                self.lock.acquire()
                try:
                    # swap the stream for the buffer
                    temp = stream
                    stream = self.buffer
                    self.buffer = temp
                    stream.truncate()
                    stream.seek(0)
                finally:
                    self.lock.release()
                if self.running is False:
                    break
            if self.preview:
                camera.stop_preview()


    def read(self):
        """Read a single frame from the camera and return the data as an OpenCV
        image (which is a numpy array).
        """
        self.lock.acquire()
        try:
            # Construct a numpy array from the stream
            data = np.fromstring(self.buffer.getvalue(), dtype=np.uint8)
            image = cv2.imdecode(data, 1)
        finally:
            self.lock.release()
        return image

    def stop(self):
        self.running = False
        self.join()
