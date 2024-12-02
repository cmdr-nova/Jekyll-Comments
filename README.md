# Jekyll-Comments
I recently launched a Sharkey instance, because, despite how much I like Mastodon, Sharkey has *many more* features, and it's more lightweight, and all that. It's nice. The problem, is "Mastodon comments" as a function don't really work too well when you toss Sharkey into the mix. So, I was faced with making a brand new comment section for each Jekyll post on my blog. A static site, with *live* comments on posts.

Obviously, this probably needs some work. I had someone test an XSS exploit, and I don't think it worked. But just that someone *thought* to do that almost *immediately* after I launched the new comments section means, I probably have more work to do!

But, regardless, I wanted to toss this up and let others have a go at it.

Firstly, copy post-comments.js into your assets/js folder (if that's the structure of your Jekyll blog, at least).
