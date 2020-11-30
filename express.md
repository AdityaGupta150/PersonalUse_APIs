#LEARNT

Redirect path ->
      1. Redirects can be relative to the root of the host name.
          For example, if the application is on http://example.com/admin/post/new, the following would redirect to the URL http://example.com/admin:
          `res.redirect('/admin')`

      2. Redirects can be relative to the current URL.
          For example, from http://example.com/blog/admin/ (notice the trailing slash), the following would redirect to the URL http://example.com/blog/admin/post/new.
            `res.redirect('post/new')`

      3. Redirecting to post/new from http://example.com/blog/admin (no trailing slash), will redirect to http://example.com/blog/post/new.

      Think of the urls as directory paths, then it will make sense

     A path value of “back” has a special meaning, it refers to the URL specified in the Referer header of the request. If the Referer header was not specified, it refers to “/”


