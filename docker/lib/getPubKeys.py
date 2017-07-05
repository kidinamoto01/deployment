#!/usr/bin/python

import sys
from utils import get_pub_keys


sys.argv.pop(0)
print get_pub_keys( sys.argv )
