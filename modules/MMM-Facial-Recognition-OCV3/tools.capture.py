#!/usr/bin/env python
# coding: utf-8
"""MMM-Facial-Recognition-OCV3 - MagicMirror Module
The MIT License (MIT)

Copyright (c) 2018 Mathieu Goulène (MIT License)
Based on work by Paul-Vincent Roll (Copyright 2016) (MIT License)
"""
import sys
from lib.tools.capture import ToolsCapture
from lib.tools.config import ToolsConfig

# to install builtins run `pip install future` 
from builtins import input

capName = sys.argv[1]
capture = ToolsCapture(capName)
print("Images will be placed in " + ToolsConfig.TRAINING_DIR + capName)

print("")
print('-' * 20)
print("Starting process...")
print("")
capture.capture()
