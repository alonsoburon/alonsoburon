---
title: 'I got a job by helping my girlfriend with her homework'
date: '2025-07-11'
description: "How helping with Stata homework led to a career in D.Eng."
---

I never planned to work with computers, much less become a Data Engineer. I was a <span class="text-negative" style="font-weight:bold;">musician</span>. A <span class="text-negative" style="font-style:italic;">struggling</span> one. The year was 2021, I was 20, and I was studying Music Composition, writing scores for student films and piss-poor videogame developers while earning a magnificent average of **15 bucks a month**.

My journey began not with a career plan, but with a girlfriend who was losing her mind over her Econometrics class. Her biggest enemy? **StataCorp** and their fuck-ass software called Stata. She ranted endlessly about how the stupid computer would *correct* her but never *auto-fix* her errors.

_"I've always had my way with computers,"_ I thought. So, I grabbed a <span class="text-neutral" style="font-weight:bold;">pirated copy</span> of Stata MP and started <span class="text-positive" style="font-weight:bold;">digging in</span>.

## The Overture: From MIDI to Munging

I roped my best friend (who was also in the class) into the chaos, and we started tackling the semester’s econometrics project. I began by throwing together some Do-files, following the TA's instructions, and moving data around.

My scripts were notoriously cautious:
```stata
* DONT REMOVE THIS OR IT BREAKS
clear all
set more off
* load the csv (CHANGE THE FOLDER TO YOURS)
import delimited "[...]", clear
```
The early grunt work was data cleaning, which was about **80% of the project**. I quickly realized that the process required intense patience and attention to detail—something I was surprisingly good at. The repetition pushed me into learning my first loops and functions.

The learning curve was steep but <span class="text-positive" style="font-weight:bold;">hilarious</span>. I spent two hours fighting the simplest concept: the backtick.

> This took me about 2 hours to get working. I'd never used backticks in my life, so I was writing 'var' instead of \`var', thanks **StackOverflow!**
> ```stata
> foreach var of varlist q87-01 q88 q90-07 {
>     replace `var' = 0 if `var' == .
> }
> ```

My best friend and my girlfriend got great grades, and I found a <span class="text-neutral" style="font-style:italic;">bizarre</span> new hobby. That settled it: I was the designated <span class="bg-neutral" style="font-family:monospace; padding:2px 4px; border-radius:3px;">programming</span> guy.

## The Crescendo: Free Money & Python

After a couple more semesters of <span class="text-negative" style="font-weight:bold;">painful</span> Stata clean-up, I was exhausted. I searched YouTube and discovered how easy and fun the process was in **Python**. It felt like <span class="text-positive" style="font-weight:bold;">pure magic</span>. I'd run a script, and the job was done. I genuinely felt like a <span class="text-neutral" style="font-weight:bold;">hacker</span>.

The best part? The Python community on **StackOverflow** was a <span class="text-positive" style="font-weight:bold;">goldmine</span> for pre-made code, making it infinitely easier to handle weird edge cases than it was with Stata.

I finally accepted my destiny and started doing homework for other students (for a fee). It was fun, easy, and made me **a ton of money** compared to music gigs. I was suddenly tutoring half the class, teaching them how to clean data in **R** and make <span id="sick-graphs" style="font-family:Impact,Arial,sans-serif; color:#ff6600; font-weight: bold; text-shadow: 1px 1px 0 #000, 1px 1px 4px #f90; animation: fire 2s linear infinite;">🔥SICK GRAPHS🔥</span> with **ggplot2**. My university performance, naturally, tanked.

<style>
@keyframes fire {
  0% { color: #ff0000; }
  25% { color: #ff8000; }
  50% { color: #ffff00; }
  75% { color: #ff8000; }
  100% { color: #ff0000; }
}

#sick-graphs {
  animation: fire 2s linear infinite;
}
</style>

## The Cadenza: ChatGPT and The Detours

I fell deeper into the <span class="text-neutral" style="font-weight:bold;">tech spiral</span>. Python became my go-to for everything: automating homework, <span class="text-negative" style="font-style:italic;">miserable</span> early attempts at websites (pure Python + HTML, because I refused to even understand whatever the fuck was going on in the web world), and even programming music using **PureData** and **Max/MSP**.

Then came the <span class="text-positive" style="font-weight:bold;">legendary</span> (and infamous) <span style="background: linear-gradient(45deg, #8b5cf6, #06b6d4); color: white; font-weight: bold; text-shadow: 1px 1px 0 #000, 1px 1px 4px #f90; padding: 2px 6px; border-radius: 4px;">**ChatGPT**</span>. It was insane! I could get answers in seconds, boosting my self-education immensely. I even briefly toyed with becoming a videogame developer.

That dream lasted exactly as long as it took me to install Unity and look at a single line of **C#**, got <span class="text-negative" style="font-weight:bold;">spooked</span>, and promptly fucked right off that whole scene. I was starting to see how <span class="text-negative" style="font-weight:bold;">tough</span> it was to be a full-time musician, and how much <span class="text-positive" style="font-weight:bold;">easier</span> programming was, even if I doubted anyone would pay big bucks for "simple" Python skills.

## The Symphony: The Unlikely Pivot

I graduated in December 2023, finally freeing myself from the <span class="text-negative" style="font-weight:bold;">shackles</span> of singing atonal music and practicing piano 2 hours a day.

The job hunt was <span class="text-negative" style="font-weight:bold;">brutal</span>. My resume was mostly music and arts stuff. My girlfriend and mom encouraged me to broaden the search into **Data Analytics** or **IT**—the kind of jobs you don't understand until you're already doing them.

I found an opening at a company called **Datawalt**, a company I’d never heard of, and applied with almost non-existent experience. I was transparent: my coding background came from helping students cheat on econometrics homework, and had zero formal education in the field.

The interview was <span class="text-positive" style="font-weight:bold;">hilarious</span>. They asked about my music, my hobbies, and the video games I played. The skill test, however, was a <span class="text-negative" style="font-weight:bold;">disaster</span>: **I got 2/10 questions right.** I took it home, hammered it out with a little help from my new best friend, ChatGPT, and sent it back *three hours later*.

To my <span class="text-negative" style="font-weight:bold;">absolute shock</span>, that was enough proof, they hired the music composer as an **Intern BI Developer**.

Within a year, that music composer was **leading their first Data Engineering team** and designing the company's main data platform.

---

## What Actually Mattered

**Interview:** Make <span class="text-positive">them laugh</span>. Show you fit the vibe. <span class="text-neutral">Graduates don't know shit</span>—be <span class="text-positive">eager</span> to learn what they actually need.

**Skill Test:** Don't stress perfection. Show how you handle gaps. It's a taste of the real job, not a final exam.

**On the Job:** Be <span class="text-positive">honest</span> about your skills. <span class="text-neutral" style="font-weight:bold;">Communication beats technical skills</span>—explaining what you build gets you promoted. <span class="text-negative">Crunching</span> gets you noticed, but use it like a <span class="text-positive">turbo button</span>—only when you really need it.



## Now

I'm still figuring it out. The team processes <span class="text-positive" style="font-weight:bold;">millions of records daily</span> for clients across LATAM. Sometimes we deal with <span class="text-negative" style="font-weight:bold;">massive historic loads</span> that take forever to run. I still do BI work for some clients; can't shake the habit that got me here in the first place.

## TL;DR

Broke music student with zero job prospects helps girlfriend with Stata homework, accidentally becomes the class unofficial tutor, applies to random data company with music degree, flops the interview but gets hired anyway, and somehow ends up <span class="text-positive" style="font-weight:bold;">leading a data engineering team</span> a year later. Still doing homework, just with a fancier title.