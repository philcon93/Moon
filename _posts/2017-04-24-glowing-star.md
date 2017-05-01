---
layout: post
title:  "Glowing Star"
date:   2017-04-24
excerpt: "Glowing star animation with happy/sad options"
sketch: true
web_component_name: "glowing-star"
tag:
- Sketch
- design
comments: true
---

Web component based on [Marjo Sobrecaray Pen](http://codepen.io/maaarj/pen/KWNLaO). This web component can take two attributes:

- `star`

The star attribute can take two values, `happy` or `sad`, which will change the stars colour and face.

- `direction`

This can take two values as well, `left` or `right`, which will change the direction the star is facing.

These attributes are optional, and the star will default to happy/left if neither are given.


<glowing-star star="happy" direction="left"></glowing-star>
<glowing-star star="sad" direction="left"></glowing-star>
<glowing-star star="happy" direction="right"></glowing-star>
<glowing-star star="sad" direction="right"></glowing-star>
