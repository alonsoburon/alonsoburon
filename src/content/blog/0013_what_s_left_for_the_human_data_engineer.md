---
title: "What's left for the human data engineer?"
date: '2026-09-23'
description: 'Code is cheap my darling, what makes you bank now?'
tags: []
---

If you wanted to enter the DE market five years ago, the training path was pretty obvious: move some CSVs around, load AdventureWorks into a database, write a few transformations, learn a warehouse.

Now the young DE starts by asking his little chat box "how to become a data engineer fast", and even a mediocre AI can make most of the low-level coding decisions for him.

So the interesting questions have moved up a level:

**What technologies do I use? Where do I put them? How do they connect? How do I keep them safe? How much will this cost?**

That starts sounding a lot like System Design.

Data engineering and systems engineering are obviously different areas, but I think the roles are starting to overlap more. As implementation gets cheaper, you spend less time worrying about how to write the transform and more time worrying about the contracts between systems, what owns what, what can fail, and what happens when two systems disagree.

After using billions of tokens, I've noticed LLMs are still surprisingly bad at that last part.

Even very capable models will often treat a `try/catch` as if that's what reliability means. Real pipelines fail in much stranger ways, decimals getting double rounded, that asshole that thinks everything is in UTC and the non-technial guy with db write access sending nulls in a supposedly mandatory field.

These kind of failures are boring, non-recurring and always ends up with your ass on the line (How didn't you predict this would happen)

The knowledge **of** them gets accumulated. Once you've seen enough broken pipelines, you start recognizing the shape of a failure before it happens. Astra or Fable might build the transform perfectly, but you still need someone who looks at the architecture and says "this assumption will break when Connie goes berserk on her Codex."

AI also doesn't solve accountability. Fable won't apologize to the client for you. Hopefully you're not sending ElevenLabs to the meeting either.

So if you're starting out as a DE, **learn systems.**

Learn the boring technologies your market actually uses. If you're working in Bolivia, you probably won't spend your first year tuning Snowflake clusters. You may end up in the on-prem, no-backup SQL Server trenches, carrying a pendrive with your pipeline compiled into an `.exe` because the client refuses AnyDesk and won't allow an external RDP connection.

I had to do this and I promise you I learned a lot more than asking Opus to teach me DE.

Keep diagrams and runbooks and, keep them somewhere you can actually find them. Keep them updated with reality.

You'll spend a surprising amount of time explaining why two systems disagree about the same customer. The answer is usually not in the code. It's a business rule, a contract somebody changed, a migration decision, a timezone or some field that means slightly different things in two systems.

Eventually you'll end up asking the oldest person in the room because they're the only one who remembers why it works that way.

Those are skills worth developing, and that will get you paid.

Read schemas like contracts and learn how the systems around your code behave when they're wrong.

The code is cheap now, judgement is how you differentiate yourself.
