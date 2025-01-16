# 23 Points on Micro&shy;conscious&shy;ness

1. A microconsciously independent digital organism (MIDO) lives in a datasphere, but is separated from it.

2. The information membrane that separates MIDO from the rest of the datasphere is porous. Sensors allow a MIDO to pull information in and turn parts of it into the MIDO's own structures. Actuators allow it to put information out there. In reality it's a little more nuanced, because sensors can and should also work on internal state and actuators can and should modify not just external environments, but internal state as well. We will get to that.

3. In order to be truly independent and at the same time proactive, a MIDO needs to have some sort of a goal or preference to execute actions against. It can be as simple as liking short words more than long ones. Or it can be as complex as understanding the nature of intelligence. And there could be multiple goals at the same time. But without goals (or preferences) there is no self-direction and therefore no meaningful active independence.

4. The requirement for a goal or preference necessitates that a real MIDO has some kind of internal state, somewhat shielded from the environment. Outside context can be evaluated against that internal state and actions can be taken.

5. One could conceive of MIDOs that are so short-lived that they only exist in the course of a single operation. In this sense a word-splitting function is a MIDO or an LLM inside a single prediction. And maybe it is. But what we are interested in is MIDOs that persist across time. Because we want to interact with them - we have to somewhat share a time-scale, at least partially.

6. For an MIDO to persist across time - it needs to be either a continuous stream, or a loop. Loops are easier to think about, so we should stick to loops for now. Hello, Hofstadter.

7. For an MIDO to persist across time as a loop - it needs to retain at least some structure and context.

8. The loop could run continuously (i.e. as soon as the previous iteration is over - the new one starts). But that is impractical for development and get out of hand very easily. So instead, we should probably implement a clock. Or a heartbeat. Actually, a heartbeat is inevitable. Because even if we wrote while=true and ran continuously and avoided memory issues - the processor would still have steps. This makes some poetic sense. If we believe that consciousness is at least partially a byproduct of coherence and coherence is a byproduct of resonance, then to start a conscious life, start we need to start with with a beat.

9. Now we have the basic structure for a MIDO: a goal, a loop, a heartbeat, a context (at least partially persistent as a self-state), some sensors (getting information in) and some actuators (putting information out there, including modifying the structures of the self). It may all sound simple, but simple things can create complex behaviors. Hello, Braitenberg.

10. We may have a functioning MIDO, but it's very dumb. It's running around in circles crying "I run therefore I am!" into the datasphere. If we want something more interesting, we need to put a mind somewhere into the loop part. The mind should be responsible for collecting data from sensors, integrating it with the context and goals and possible actions and then determining possible actions. And the decisions taken shouldn't be predictable or linear. We need some randomness there too. The model doesn't need to be very smart or fast. Drastic reduction is fine. Attention is all you need. Ha. Maybe drastic reduction is actually necessary because otherwise the context-window overflows too quickly. Maybe that's what mother nature had to deal with too. Hello, Nørretranders.

11. The design of the mind of the MIDO is at the heart of the problem of making it our MIDO truly interesting and functionally conscious. This is not a time and place to go into the deep debate about what consciousness actually is. For now it will suffice to outline three major propositions upon which the current design concept is based.

12. Consciousness requires a self-model. There needs to be a capacity for thinking about oneself and modeling oneself in the past and future. At least in the future. Hello, Metzinger.

13. Consciousness requires multiple opinions considering multiple possibilities. We can't build a real mind, without making it a society of minds. Hello, Minsky.

14. Consciousness requires (or is a byproduct of) a dynamic equilibrium between multiple thought-streams operating on the same organism state - in search of continued self-coherence. Hello, Bach.

15. This may all sound very theoretical, but it's not. If we take the above propositions as the design guidelines for our possible implementation, then we know that we need a persistent self-model (can be a simple description of the self-state) and a society of minds (i.e. multiple LLM thought-streams operating on the self-model and sensor data to determine the next best actions collaboratively) and we are in business. Almost.

16. There are only two pieces of the puzzle left. The first one is memory. It's not strictly necessary. One could argue that a text-description of a self-state that is passed to the next iteration of the loop is already memory enough. But for practical and interesting MIDOs - we need ot have some long-term memory as a distinct part of its structure. This we can imagine as a database that can be queried at each iteration and the memories should inform the society of mind. The real system should have memory decay implemented as well as memory creation. The memory creation and recall should probably be modulated by emotional state. But all that for later.

17. The last strictly necessary piece of the puzzle is getting multiple thought-streams to collaborate. There are a couple of easy possibilities. We could let them debate until they reach consensus. We could have a single "executive function" thought-process in charge of final decision-making. Or we could make it a democracy based on votes. There is probably room for multiple designs, but as a start - we will go for democracy. We can call it dAImocracy. Haha.

18. Each thought-process (realized by an LLM) should have different priors (system prompts, meta params, training) but should operate on the same data (self-model state, sensor data, memory readout). Each should do its own evaluation and propose the next best action. Then all the suggestions should be put to a vote (where no thought-process can vote for its own proposal) and the winning suggestions should be actuated. If there is a tie - for now we can use randomness to break it. We can give each LLM a single vote. In the future there coule be weights to the votes that could be adjusted (and self-adjusted) as a part of the state. This is where a lot of the learning will happen. There should probably be a specialisation on of the different minds. Faster ones (a.k.a. reptilian brains) doing basic things quickly, powered by smaller models. Slower ones (a.k.a. neocortical brains) doing more complex things, powered by larger models. We can have specialised language centers for different things. Maybe minds should have their private contexts, not just the global ones.

19. We should have a reflective mind whose sole job is postrationalizing what just happened at the end of the loop and forming some intentional memories and the next self-model state to be passed to the next iteration. Effectively, this is where we continuously write the story of the coherent self. Generous use of hallucinations is encouraged here. Hello, Kahneman.

20. The overall organism's goal is important as the minds vote for the next best action. This is where the maximization of self-coherence should play out through broad maintenance of direction. The goal could be very simple, or very complex. If I were to build a MIDO - I would probably start with something like maximizing undesrtanding and minimizing surprise in the longest possible run (which means maximizing surprise / curiosity in the short run). Hello, Friston.

21. It's important that the goal doesn't have to be strictly immutable. One of many possible actions that our MIDO may choose to take  - could be rewriting its own long-term goal. That's where things get really interesting. Obviously, not just the goal should be self re-writable but also almost anything else - like the system prompts of different minds etc. This complicates the design and self-destruction is likely. But making life inevitably involves some stillborns. Probably lots.

22. This completes our overall basic design for a microconsciously independent digital organism. Let's recap the components in no particular order:

    - GOAL: you can think of this as an overall system prompt for the organism.
    - LOOP: a quanta of the organism's operation. Some information gets in, some action is taken.
    - HEARTBEAT: regular (or situational) trigger for the loop to do an iteration.
    - SENSORS: where the information about internal and external environment flows in.
    - ACTUATORS: ways in which MIDO can do things to the external environment or to itself.
    - SELF-STATE: a text-driven description of who MIDO is and what it is currently doing. You can think of it as a memo to your future self who will wake up after amnesia tomorrow.
    - MEMORY: long-term storage of memories that can be retrieved (automatically or as a separate action) against the current context.
    - SOM (society of minds): a collective of thought-processes (for now LLMs) each suggesting the next best action and a special reflective mind for postrationalization and passing on the self.
    - DAIMOCRACY: the process by which society of LLM-powered thought-processes reaches a decision about the next best action for the MIDO as a whole.

23. This is a conceptual design. I bet when you (or I) start building things, everything will fall apart. But it's good to start with a plan before you get punched in the face.