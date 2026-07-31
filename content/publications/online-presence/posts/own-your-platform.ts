export const ownYourPlatform = `
# Own your platform

If your writing lives on someone else's platform, you are a tenant. That is not a complaint about any particular company. It is a description of the arrangement, and it is worth understanding before you spend another five years building on it.

## What actually goes wrong

The dramatic version of this argument is about censorship. That happens, but it is not the common case, and leading with it makes the whole argument easy to dismiss. What actually happens is duller and far more frequent.

**A policy changes.** Not aimed at you. Your work happens to sit on the wrong side of the new line, and there is no one to appeal to who has the authority to care.

**An automated system flags you.** A model decides your post breaks a rule. The appeal goes to another model. You are correct and it does not matter.

**Reach quietly stops.** Nothing was removed. The ranking changed, external links are now demoted, and the audience you spent years assembling no longer sees you. Nobody told you, because from the platform's side nothing happened.

**The business pivots.** The feature you built around is deprecated, the payout terms change, the free tier that made it viable ends.

**The company sells, or closes.** Your archive is now someone else's asset, or a download link with an expiry date.

None of this requires anyone to have wronged you. It requires only that the decision was never yours.

## The part most people get wrong

Here is where this argument usually overreaches: running your own site does not make you invulnerable, and anyone who tells you otherwise is selling something.

You still depend on a chain of other people:

- A **registrar**, which can be pressured into taking your domain.
- **DNS**, which resolves your name into an address.
- A **host**, which serves your files. Vercel, Netlify, and Cloudflare all have acceptable-use policies and all enforce them.
- A **CDN**, which sits in front of your host.
- Search engines and social networks, which still decide whether anyone finds you.

Owning a blog does not exit the system. Anybody claiming otherwise has not read their own hosting agreement.

## So what do you actually gain

**Portability.** Not immunity — portability. That is a smaller claim and a real one.

The question worth asking about any arrangement is not "can this be taken away" but "what would it cost me to leave". On a platform, leaving usually means abandoning your archive's addresses, your formatting, your subscriber list, and every inbound link anyone has ever made to your work. That is what lock-in actually is: not that you cannot go, but that going costs you everything you built.

When you own the content and the code, leaving costs a deployment. The writing is a directory of files on your own machine and in version control. The renderer is a program that reads those files. If your host suspends you tonight, you point the domain at a different one and deploy the same files. An afternoon, not a rebuild.

This site is built to make that literally true. The writing lives in one directory with no dependency on the framework that renders it, which is documented at length in [The content contract](/blog-platform-docs/content-contract). The website could be deleted and rewritten in something else without touching a word of the writing.

## Two things worth owning above all

**Your domain.** This is the single highest-value thing on the list, and the cheapest. A domain is your address, and it is the one part of the arrangement that is genuinely yours for as long as you renew it. If your work lives at someone-else.com/yourname, then every link, every citation, and every search result you have ever earned belongs to them. Move, and it all breaks. With your own domain, you can change host, framework, and publishing tool as often as you like and every link keeps working.

If you take one thing from this post: buy the domain. Even if you keep writing where you write now, and point it there.

**Your archive, as files.** Not as an export button you have never tested. Check what a platform's export actually contains. Does it include your images, at full size? Your post addresses? Drafts? Comments? A ZIP of unformatted text is not an archive; it is a gesture at one.

## The honest cost

Running your own site costs you things a platform gives away.

You lose the built-in audience: nobody is going to hand you readers. You lose the frictionless writing experience, unless you build one. You take on responsibility for uptime, upgrades, and security patches. And there is no one to complain to when it breaks, because it is yours.

For plenty of people that trade is wrong, and this post is not an argument that everyone should self-host. It is an argument that you should know which of these you are choosing, and that the domain is worth owning either way.

## Where to start

If this landed, the practical question is what to do about it. There are three routes, depending on how much of it you want to do yourself: [Three ways to build your own blog](/online-presence/three-ways-to-build-a-blog).
`
