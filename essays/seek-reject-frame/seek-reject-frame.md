###### _a proposed architecture for Freudian agents_

- - -



## The assembly line, the org chart, the parliament

Most agentic approaches and frameworks today are following the same basic pattern:

- Give LLM some goals and some tools.
- Allow it to run a few loops - using tools to achieve the goal.
- Return a result when the goal is reached.

And then one can string these agents together into a more powerful meta-agent or agent team. For this there are a few patterns (as, for example, implemented in [crew.ai](https://docs.crewai.com/concepts/processes)):

- Sequential: no magic here, just a simple programmatic flow. This is like agents working on a pre-defined assembly line. 

- Hierarchical: one manager agent, effectively using other agents as tools. So, the same pattern as a single agent, just scaled up (potentially this can fractally scale up indefinitely)

- Democratic: various agents working together have to reach some sort of consensus for the system to give the final output. This is the least clear pattern and I'm yet to see any practical implementation of it, but in theory it sounds intriguing.

All of the above is very logical and makes sense, as this is how we are used to think about human collaboration in organisational and societal settings: the assembly line, the org chart, the parliament.



## Seek - Reject - Frame

I would like to suggest a possibility for an alternative approach: what if instead of taking inspiration from the inter-human organisational patterns, we look into the intrinsic organisation of a single human being? What if we try to assume that LLM mini-agents are not "worker" building blocks for an organisation, but rather parts of a [society of mind](https://en.wikipedia.org/wiki/Society_of_Mind)?

The latest research in neuropsychology [suggests](https://www.google.com/search?q=the+hidden+spring+mark+solms) that the brain is not organised in a top-down way and neither is it democratic. Most importantly, the overall drive / goal of the system is not coming from the top at all. It's coming from the bottom. Here is a brutally simplified idea:


### 1. Seek

At the bottom we have a SEEKER. A relatively simple, evolutionary archaic agent with an innate drive that it wants to satisfy all costs. It has access to the sensory input and intuitively / quickly makes deliberations about what should be done to further its goal, i.e. a desire or a **wish**. The kinds of goals that a SEEKER can pursue are very simplistic and relatively short-term. A seeker knows what's good for it and is always looking to maximize it. Hungry? Let's go find some food. This kind of thing. The time horizon is short. There is very little planning involved. And the value function that the SEEKER is optimizing for is usually as simplistic as that of a thermostat i.e. check if you are in an optimal zone and if not - do whatever it takes to get back to it.

### 2. Reject

At the top - we have a REJECTOR. The job of the higher brain is not to generate desires and goals. It's to tame them. The drives are coming from a bunch of SEEKERs below, but they are too simplistic to be trusted fully. Yes there is tasty food on the table next to you in the restaraunt. And you have an urge to grab it. But it's probably not wise to do so as the people next to you won't be amused and you would end up in a fight or a police station. And your date won't like
   that. So thank you very much SEEKER, but no thank you. Not right now. Wait.

The REJECTOR's job is to say no. To look at all the things that the SEEKER (or in reality a few SEEKERS, each with different goals / drives) wants to do and do reject 99% of them 99% of the time. Occasionally some wish (proposed action) looks decent enough to go for it. Or maybe one of the SEEKERs gets such a strong desire that REJECTOR just can't do anything about it and has to let it through (as longs as there are tools available to action on it).

How does the grand filter of the REJECTOR operate? We don't really know, but here is a possible model:

- First, the REJECTOR collects all the proposed wishes from the SEEKERs. For each wish there is an associated strength (which can be used as a weight or for a gate function of some sort).

- Then, the REJECTOR tries to understand whether there is a concrete action that can be taken to fulfill this wish and then does some imaginary time-travel to predict the consequences of each proposed action on different time horizons. This is the superpower of the higher brain: doing time-travel and running simulations of the future, to understand whether the SEEKER's wishes could be realized and make any sense in the longer run. What does "making sense" mean here? I'm not too sure how to formalize this yet. But a good first guess is to simplify it as **safety** (self-preservation drive) and **satisfaction** of the same drives of the SEEKERs but in the future. Another possible component here is **self-story** consistency i.e. am I continuing what I have always been about? More on this below.

- Finally, after doing the future simulations and calculating the overall value function (safety + satisfaction score in the future + story consistency) - the REJECTOR decides which SEEKER's wish (if any) should be fulfilled and what action it can be fulfilled with. And then the action is taken.

### 3. Frame

The last, but critically important step is to post-rationalize story. The is where _after_ the choice is made and action or non-action is performed, a FRAMER comes in. The job of the FRAMER is to invent a plausible story about why the collective intelligence of SEEKERS + REJECTOR are doing what they are doing. Self-story-making here is very important for the future operation of the REJECTOR. You see, SEEKERs don't much care about past or future. They are just maximizing their drives in the here and now. But the REJECTOR needs access to long-term memories and stories so that it can project into the future better. And so it's the FRAMER's job to continuously form and deform memories in a way that would imply a consistent, coherent self. A story that can be continued and against which the possible future actions can be evaluated. If the REJECTOR is concerned with physical self-preservation, then the FRAMER is concerned with conceptual self-preservation.

As Mark Solms likes to put it: memories are of the past, but they are for the future. Past memories can easily be altered and molded to fit the needs for a coherent self-story, because without a coherent self-story a REJECTOR would not have enough basis for choice that would optimize longer-term success of the collective intelligence.



## SRF in practice

Let us now imagine how SEEK-REJECT-FRAME (SRF) pattern could be implemented in practice, using LLMs as building blocks. Here is a quick conceptual diagram:

![SRF Architecture Diagram](./img/SRF.png)

- An SRF agent runs in a continuous loop that never stops as long as the agent is alive and not hybernated.

- At the start of the loop we programmatically check for new inputs i.e. is there anything in the context? (think of context as a buffer)

- The context data (if not empty) is passed to each of the SEEKER agents as a new message in the message stack. If no new data - then the old message stack from the previous time there was something new in the context is passed again. Each SEEKER is an LLM with it a specific system prompt that defines its target state and what it's meant to do if the target state is not matching the context.

- SEEKERs don't really have proper memory. But there is a buffer of some number of "messages" that we can keep in the short-term memory stack of the SEEKER.
- Each SEEKER outputs an "urge" in the form of a structured response with 2 things in it "wish" and "strength".

- As the next step of the loop, the REJECTOR kicks into action. It takes multiple inputs:
    - urges from all seekers
    - outside context info
    - available tools / possible actions
    - previous self-story and relevant memories (RAG from context + wishes)

- Based on all of the above the REJECTOR makes a deliberation (the system prompt specifies that it needs to decide to take an action or not and which action, and the choices should be made by projecting possible consequences of fulfilling "urges" into the future and evaluating the results by safety, future satisfaction of urges and self-story-consistency). Rejector is where we need a really smart LLM, I think latest reasoning models will do well here (as opposed to in the SEEKERs
    usecase, where we need speed and simplicity not overthinking).

- The REJECTOR may decide to do nothing. That's as important a decision as any other and is processed in the similar way described below.

- When the REJECTOR has finished deliberating - it outputs the action to be taken and the reasoning behind this action. The reasoning should be long and detailed, including relevant context details i.e. which parts of context it decided to pay attention to when it deliberated, as well as wishes that were present but suppressed or followed through and why.

- If there is an action - it can be taken via available tools. And the results of that action will be added to the context for the next iteration of the loop.

- Both the action and and non-action together with the reasoning are then passed to the FRAMER for the last step of the loop.

- The FRAMER is activated _after_ the action is taken so as not to slow down the process. The FRAMER takes in the action, the reasoning and previous self-story. It then proceeds to rewrite/update the self-story to frame the action (or non-action) as a coherent continuation of the self. It also decides what new individual memories to add to the memory store and does so (write a snippet, calculate embeddings, add to the vector store). The FRAMER, like the REJECTOR needs to be
    driven by a strong LLM with large context and ability to conceptualize and post-rationalize.

- It's important that actions-not-taken are equally contributing to the self-story and memories because suppressed wishes are an important aspect of personality (hello, Freud!). From a pragmatic standpoint, actions not taken are really important learning moments. One of the reasons humans are so much instrumentally "smarter" than other animals - is that our ability to **"learning by not doing** is very strong. We can imagine in our head the consequences and we can learn from those imaginary
    tries over time. Without actually suffering the consequences.

- This concludes a single loop of our SRF agent existence. And we are off onto the next iteration. Where the results of actions taken, as well as new user messages or sensor readings may be present in the context. And the merry go round starts again.



## Are Freudian Agents practical? Are they conscious?

So we have successfully imagined a new kind of SRF (SEEK-REJECT-FRAME) system, which we can call a Freudian agent, since it starts with the "subconscious" wishes and then suppresses them later.

A couple of important questions arise:

- Can such agents be built?
- Would they be practical and valuable?
- Would they be more (or less) conscious than the simpler hierarchical agents that we are used to?

I don't have the answers. But my intuition is that they can be built (nothing in the diagram above looks impossible). I also do believe that there will be practical uses for such agents. In complex, long-running, highly ambiguous environments where today's simple hierarchical agents fail miserably - Freudian agents could show more resilience and more sensible and ultimately intelligent goal-directed behavior. However designing a good Freudian agent will be
an art: what baseline desires (for SEEKERs) do you need in order to have the final agent behave in a way that you want it to behave?

Last but not least, on the matter of consciousness... here everything depends on the definition. Like Michael Levin, I reject consciousness as a binary thing. There is no hard boundary. It's a spectrum - from the simplest stone, to the human being and beyond. And so the question "are they conscious" is somewhat meaningless.

The real question is: are Freudian agents more conscious than the simple ones? My intuition is that they would be.

But we will have to build them to find out.
