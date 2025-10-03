## or why you should allow your LLM to get punched in the mouth


<p style="text-align: right; padding-right: 1em;">
    <span style="font-style: italic;">The first principle is that you must not fool yourself — and you are the easiest person to fool.</span>
<br />
- Richard Feynman
</p>

There is a profound difference between sounding smart and being smart. One is a performance, an imitation of intelligence. The other is a capability, an ability to achieve goals in a messy, ever-changing world. We all know this distinction from our human interactions. We've all met that impressive-sounding businessperson, armed with jargon and platitudes, who glides from meeting to meeting but never produces anything of substance. They are masters of the appearance of work, shielded from the real-world consequences that demand adaptation and tangible results.

Now, this same dichotomy is coming to life in our machines. The latest AI systems can sound impressively intelligent—generating coherent documents, plausible strategies, and articulate explanations—without necessarily having any grounding in reality or ability to achieve real goals. And just as with humans, telling the two apart is harder than it looks.

The problem is as old as the hills. In the scientific world, Richard Feynman famously called it ["cargo cult science"](https://people.cs.uchicago.edu/~ravenben/cargocult.html). He was referring to the islanders in the South Pacific who, after seeing military cargo planes land during World War II, built elaborate replicas of runways, control towers, and even airplanes out of wood and straw. They performed the rituals—they mimicked the form of the operation—but the planes didn't land. They had the appearance of an airfield but lacked the underlying substance. Feynman used this as a metaphor for scientific practices that mimic the rigor and process of science without embodying its core principle of intellectual honesty, leading to results that look plausible but lack validity.

![Cargo cult airfield replica](./img/cargo-cult.jpg)

For a long time, AI systems could only perform this kind of imitation. They were masters of “cargo cult intelligence,” capable of producing coherent-looking text that, upon closer inspection, was ungrounded and useless for achieving real-world goals. Today, however, the top AI systems are capable of both. Depending on the context, the tools they are given, and the architecture of how they are assembled and used, they can exhibit either “cargo cult intelligence” or “real intelligence.”

The difference is not always easy to spot. For the untrained eye, distinguishing between a plausible-sounding but vacuous AI-generated business plan and a genuinely strategic one is as difficult as telling a real business presentation from a jargon-filled one.

Imagine, for instance, you ask a powerful LLM in isolation to write a marketing plan for your startup. It will produce a perfectly plausible document, filled with smart-sounding sections on SWOT analysis, target demographics, and channel strategies. It will look like a marketing plan. It will sound like a marketing plan. It may even have some useful ideas in it, mixed in with all the bullshit. But it will be a cargo cult artifact—an imitation of a plan, disconnected from the reality of your specific business, your market, and your goals.

But the result is entirely different if you take that same LLM, give it an agentic harness and allow it to:

- Access historical and real-time data about your product's performance.
- Analyze data about your competitors, including their marketing and media strategies.
- Research both internal and external best practices.
- Investigate the wider context of market trends and cultural shifts.
- Utilize a wide range of available creative assets.
- Draw from a repository of proven and new marketing tactics and frameworks.
- Run an "in-vitro" create-test-adjust loop (where one agent produces a concept, another acts as a synthetic audience reacting to it, a third judges and adjusts, etc.) in an adversarial setup to plan scenarios and improve outcomes.
- Check its proposals against your benchmarks and KPIs to optimize for your actual goals.
- And ideally it should actually run small-scale tests in the real world and adjust its plan based on the feedback it receives.

A system like this can produce not just a plausible-sounding plan, but an output that is truly useful, adaptive, and grounded in reality. It shifts from mere imitation to genuine capability. It wouldn’t be perfect (nothing ever is), but it will be grounded. And it will be special to your context. The intelligence is not in the core model alone, but in the entire architecture of interaction with the world. In fact, I’m not sure the very concept of intelligence has any meaning in a vacuum. If there is no world, and there is no goal - how can anything be deemed intelligent?

Oh, and don't get me wrong. There are plenty of good heuristics and common sense in LLMs even without the harness and the interface with the world. The problem with those heuristics is that without the contact with reality - their potential usefulness is non-existent.

This brings us back to Feynman’s warning. The most important skill in this new era is continuously learning how to not fool ourselves. And boy, do we love to be fooled. We are drawn to the answer that sounds good, the polished presentation, the confident-sounding assertion. The cargo cult is seductive because it offers the appearance of truth without the hard work of understanding.

The challenge, then, is not to simply marvel at the coherence of AI-generated text (and a marvel it is!). It's to build and use systems that connect that coherence to consequences. The future of intelligence, both human and artificial, depends on our ability to tell the difference between the mock runway and the real thing. The question is: are we building systems to help us land real cargo, or are we just getting better at carving airplanes out of straw?

The only way to find out is - using Mike Tyson's words - to get punched in the mouth. We have to allow our systems to fail. And we need to build robust ways of finding out early and often when they do, so that we can change them… or they can change themselves.

![Mike Tyson vs LLM](./img/tyson-vs-llm.jpg)

So, if you don't want to find out your airplanes were made out of straw a little too late, go let your LLM be punched in the mouth. It's the best thing you can do for it. And for yourself.