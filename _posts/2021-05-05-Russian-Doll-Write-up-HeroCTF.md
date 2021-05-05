---
layout: post
title:  "Russian Doll Writeup!" 
---

<h1 style="padding-left:25%,">Russian Doll — Write up (HeroCTF)</h1>
<h5 style="padding-left:25%"><i>This is my write-up for the ‘Russian Doll’ Challenge in HeroCTF 2021</i></h5>

<h2 style="padding-left:25%">Part 1: Assessing the given material:</h2>

<p align="center">
  <img src="/assets/images/russian-doll/1.png">
</p>
<h3 style="padding-left:25%">We are given a zip file, upon inspection, it’s a never-ending loop of folders nested into each folder just like a Russian Doll!</h3>
<p align="center">
  <img src="/assets/images/russian-doll/2.png">
</p>
<h3 style="padding-left:25%">To get the flag inside this zip we will be writing a script to loop through the zip and get only the contents inside.</h3>
<center><p style="font-size:30px">.  .  .</p></center>
<h2 style="padding-left:25%">Part 2:</h2>
<h3 style="padding-left:25%">I have written a simple Python code that loops through the zip and extracts only the text file to a given location.</h3>
<pre style="margin: auto"><code>
import os
import shutil
import zipfile
my_dir = r"./fileexport"
my_zip = r"./archive.zip"
with zipfile.ZipFile(my_zip) as zip_file:
    for member in zip_file.namelist():
        filename = os.path.basename(member)
        # skip directories
        if not filename:
            continue
    
        # copy file (taken from zipfile's extract)
        source = zip_file.open(member)
        target = open(os.path.join(my_dir, filename), "wb")
        with source, target:
            shutil.copyfileobj(source, target)</code>
<pre>
