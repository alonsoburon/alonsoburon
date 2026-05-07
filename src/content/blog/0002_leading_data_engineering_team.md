---
title: 'I got promoted to team lead by thinking about scalability'
date: '2025-09-15'
description: 'Go for growth, not just technical skills'
---

When I started at Datawalt in May 2024 as an **Intern BI Developer**, I had no idea what the company actually did. I just knew they hired me despite my spectacular failure in their technical interview, and I was grateful for the paycheck.

Fast forward one year, and somehow I'm <span class="text-positive" style="font-weight:bold;">leading their first Data Engineering Cell</span>. How the hell did that happen?

## The Chaos Begins

My first week had me doing almost no Business Intelligence. Instead, I was given the task of cleaning up their data systems and developing custom visuals in Deneb. Both tasks were <span class="text-negative" style="font-weight:bold;">nightmares</span>, but I got them done quickly and it got me noticed by our clients.

The company's data management was so chaotic, it made my girlfriend's Stata homework look <span class="text-positive" style="font-weight:bold;">enterprise-grade</span>.

## The "Best Data Team in LATAM" Dream & The Scalability Problem

During my second week, I overheard the CEO talking about becoming "the data team to lead LATAM." I had no idea what that meant, but it sounded ambitious. Turns out, Datawalt was trying to compete with other Latin American data companies that had <span class="text-negative" style="font-weight:bold;">terrible data systems</span>, despite them being more established.

The challenge became clear as the months progressed: if we wanted to fulfill the CEO's *insane* vision, we couldn't just have a slightly better system. We needed to unify our messy data into something homogeneous and actually usable, so BI developers could work with it without having to pull out Python scripts every five minutes. 

> **This wasn't a technical issue, it was a problem of scaling the entire operation.** Every new client meant a new mess, and that was a blueprint for failure.

## The Python Solution (The egg that birthed Warp)

Since I only knew Python from helping students cheat on homework, that's what I used. I started building scripts to automate the data extraction process. My first script took 3 hours to run and crashed halfway through, but it was better than having to set up 20 scripts to extract one by one on our legacy orchestrator.

The breakthrough came when I realized I could abstract the data extraction process into a single function that would extract data from multiple sources and dump them into a single dataset in our new data warehouse.

```python
# Example, won't tell you how the real sausage is made
@dlt.resource(name=table_name, write_disposition="merge")
def extract_data(context, table_config, lookback_days=None):
    query = table_config["sql_query"]["full"]
    if lookback_days:
        query = table_config["sql_query"]["incremental"]
    
    conn = dbapi.connect(**context.resources.hana_config)
    cursor = conn.cursor()
    
    try:
        cursor.execute(query.format(days_to_load=lookback_days or 0))
        columns = [col for col in cursor.description]
        
        for row in cursor.fetchall():
            yield dict(zip(columns, row))
    finally:
        conn.close()
```

> The first script I wrote was my <span class="text-positive" style="font-weight:bold;">masterpiece</span>. It processed 1.5 million records in 10 minutes instead of the 8 hours it took normally.

## The Birth of Warp: The Gateway to the C-Suite

Working hand in hand with the CTO to design a more workable data system, we created a patchwork of scripts that gradually became the core of our new data platform: **Warp**.

But here's the thing: Warp wasn't just another tool. It became the <span class="text-positive" style="font-weight:bold;">catalyst</span> that made everyone realize we needed to completely rethink our data architecture. Before Warp, each client had their own messy data pipeline, each BI developer was writing custom Python scripts, and nobody could find anything.

By the end of the year, we were plugging multiple clients into our data warehouse with Warp, and something magical happened: **BI developers stopped writing Python scripts**. They could finally focus on what they were actually hired to do: create insights and reports, instead of spending their time handling VPNs and connections to databases.

By March, Warp was turning into a <span class="text-positive" style="font-weight:bold;">fully-fledged data platform</span> with a custom ELT engine, data quality checks, and notifications for when something goes wrong.

The success of Warp made the company realize that <span class="text-neutral" style="font-weight:bold;">homogenizing everything in a data warehouse</span> wasn't just a nice-to-have, it was essential for scaling. But here's the key: I didn't just solve a technical problem—I demonstrated a **scalability-first mindset** that caught the C-suite's attention.

The shift happened when I stopped thinking about *my script* and started thinking about *the company's growth*. When you show leadership that you're thinking about how the company can grow and handle **ten times the clients** without falling apart, you become invaluable. 

> That's what got me promoted to team lead, not just coding chops, but proving I understood the strategic value of a scalable architecture, which is the only thing the C-suite truly cares about.

## Building a Team (AKA Finding People to Handle This Madness)

The success demanded more hands on deck. The first person we got was a <span class="text-neutral" style="font-weight:bold;">recent data engineering graduate</span> who was eager to learn and had a lot of potential. We also needed someone to handle the incoming BI requirements.

Together, we became Datawalt's first Data Engineering Cell. Our mission: <span class="text-positive" style="font-weight:bold;">scale ingestion</span> for the growing number of new clients without losing our minds in the process.

## What I Actually Learned About Leadership (When You're a Total Beginner)

Leading a team when you're so young and naive is <span class="text-negative" style="font-weight:bold;">tough</span>. Turns out the things you think are the toughest are generally not that hard. And the things you took for granted are <span style="background: linear-gradient(45deg, #ff4757, #ff3838); color: white; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); padding: 3px 6px; border-radius: 4px; font-family: 'Arial Black', sans-serif;">FUCKING HARD</span>.

As a first-time lead, I quickly learned that the people challenge makes the technical challenge look like *coloring a kid's book*.

**Handle the egos:** The guys take pride in their work and their ability to learn how to do what you asked them to do on their own. If you micro-manage or give them too much guidance, they may get frustrated or straight up ignore some of your requirements. This turns into multiple rounds of iteration on stuff that could probably be solved in a single chat. 

> My biggest lesson? Give the problem, not the exact solution, and let them own the win.

**Handle the rules:** The guys need rules. We all know that entry and leaving times are bullshit, but not everyone is designed for handling "oh don't worry about getting here late" because then you'll end up with a snowball of missed calls or meetings with clients when you need them most. Freedom is great, but consistency is king for a functional, growing team.

**Handle the difficulty:** The guys need a challenge. If you give them tasks that are too easy, they may get complacent and stop growing, which turns into you having a *piece of furniture* for a coworker when you need them to do something more complex. Always pitch tasks that are **10% outside their comfort zone**.

**Handle the communication:** The guys need to be able to communicate with you and tell you when they're having a hard time. They may be exhausted but too proud to ask for help, and you'll end up with a burned out team member who's angry at you for overworking them. Your job is to create a safety net, not just a to-do list.

## TL;DR

I got hired as a data intern despite bombing the technical interview, discovered the company's data systems were chaotic, and accidentally built a data platform. The promotion wasn't about the code; it was about demonstrating a **scalability-first mindset** that solved the C-suite's growth pain point. I somehow ended up <span class="text-positive" style="font-weight:bold;">leading a team</span> only to find out that the real challenge isn't data pipelines—it's managing the *brilliant, complicated people* on it.