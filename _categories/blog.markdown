---
title: Blog
date: 2018-02-03 17:55:00 +02:00
pathSpec: "/blog/:pageNumber(-\\d+-)?/"
tags:
- paramorph
- static
- blog
- generator
- news
- changelog
role: category
---

<div>
  <Feed
    posts={ paramorph.collections['Posts'].posts }
    batchSize={ 2 }
  />
</div>

