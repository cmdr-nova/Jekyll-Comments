# Jekyll-Comments
I recently launched a Sharkey instance, because, despite how much I like Mastodon, Sharkey has *many more* features, and it's more lightweight, and all that. It's nice. The problem, is "Mastodon comments" as a function don't really work too well when you toss Sharkey into the mix. So, I was faced with making a brand new comment section for each Jekyll post on my blog. A static site, with *live* comments on posts.

Obviously, this probably needs some work. I had someone test an XSS exploit, and I don't think it worked. But just that someone *thought* to do that almost *immediately* after I launched the new comments section means, I probably have more work to do!

But, regardless, I wanted to toss this up and let others have a go at it.

Firstly, copy post-comments.js into your assets/js folder (if that's the structure of your Jekyll blog, at least). Then, put the CSS into assets, and edit it however you like. Afterward, copy the comment section div into your post.html file in _layouts.

Now, comes the fun part.

Wherever you have a server, I dunno, in space, underground, on some dude's face, whatever, wherever, copy all those files in the root directory of this repository and edit them to reflect what your information and credentials *actually are*.

Setup PM2 on post-comments-proxy.js and monitor-comments.js, then save, and ensure it starts with system restarts.

For lack of time, and because I'm tired, I'm not going to type out all the billions of things you need to install to make this all work. If you want to see what you need, all the requirements are in the headers of the scripts. You *will* need an environment to utilize Python and install dependencies, and the monitor depends on WatchDog.

Now.

Here's an explanation of what all this does:

The field entries allow a visitor to specify their name, fediverse handle, and their comment. The fediverse handle will be automatically built into a URL that links their handle to wherever they are on the fediverse. If a user tries to input a word or phrase that you have in your forbidden words json, it won't let them post, *at all*. And since it's server-side, they can't mess with it, or force their browser to turn it off. The comments update *live*. They will appear on the page as if it's not a static site at all. It's almost like magic. The monitor script watches to see if there are *any new comments on your website at all*, and if there are, it uses gmail's API to send you an e-mail notifying you that there is a new comment, and what that comment says. This is important, just in case you're being trolled and need to clamp down.

It's all very simple, but also very copmlicated. 

If you need help with any of this, please just contact me on my instance at <a href="https://sharkey.mkultra.monster/@cmdr_nova">@cmdr_nova@mkultra.monster</a>.
