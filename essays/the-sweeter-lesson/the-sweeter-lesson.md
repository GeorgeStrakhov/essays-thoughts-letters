
In March 2019, just as Deep Learning revolution was gathering steam and the signs of the new AI Spring were starting to become widely visible, Rich Sutton published his ["Bitter Lesson"](https://www.cs.utexas.edu/~eunsol/courses/data/bitter_lesson.pdf).

His main argument can be broadly summarized as follows:

0. (Underlying Assumption): People tend to care about AI's specialized ability (e.g. translation, programming, playing chess, image understanding and manipulation, doing laundry etc.), not about its general ability to learn and reason in the abstract.

1. If you are trying to increase specialized ability, it's natural to try and imbue the AI agent with some human-validated knowledge about the problem domain. For example if a researcher wants the AI agent to play chess better, they would aim at extracting some deep knowledge about the nature of the game and decision-making heuristics from expert humans (grandmasters) and then put that knowledge into the programming of the agent.

2. This approach, though natural, is misguided. It may lead to short-term increases in specialized ability. But in the long run - raw increase in computing power will inevitably make the approach obsolete. General systems capable of end-to-end learning are going to find their own heuristics and generalizations more suitable to their way of thinking and the amount of compute available. The textbook example here is Deep Blue - the first computer to beat a Chess World Champion in 1997. It managed to achieve this level of specialised ability not through better "understanding of the game", but almost exclusively through brute-force search. Since then better approaches of generalized autonomous learning - such as self-play - have allowed computers to unlock superhuman abilities in even more "difficult" problem domains such as Go (difficulty here refers to the branching factor of possible positions, making pure search too costly for both humans and machines).

3. The bitter lesson is that working on specialized AI agents by focusing on increasing specialized knowledge is not an effective long-term strategy. A much better strategy is to focus on increasing general learning capability and providing the best possible specialized context. By context here I mean not just information, but also tools and interfaces with the world that are necessary for proper self-play or, more generally speaking, for real-world execution with a feedback loop. Different versions of such specialized context need to be provided both at training time and at execution time in order for the agent to be as effective as it can be.

[ diagram : the bitter lesson]

_The best way to increase an AI agent's special capability is to increase its general capability and provide it with special context_

(vs. sweeter lesson: there are very few interesting and economically valuable problem domains in which all we care about if obviously defined and clearly measured, one-dimensional performance metric. For the vast majority of human activity the reward function is ambiguous, personal, circumstantial and transient.

The real job is and has always been figuring out who _we_ are and what _we_ want.

//term: narrowmaxing behavior (!)
anthing that can be narrowmaxed - should be.

The economically valuable jobs will be the philosophically interesting ones.
)

[ /diagram ]

This lesson feels bitter because it effectively states that the specialized knowledge that human experts worked so hard to acquire and that they take great pride in - is not in any way absolute. It is in fact almost "useless" in an absolute sense. Sutton's principle shows that the hard-learned heuristics that humans develop when interacting with a certain problem domain are not inherently valuable or "truthful" in relation to this domain. They just represent a certain level of abstract patterns that seem relevant to us and suitable to our natural mode of computation as well as the amount of available compute. A different system with a different amount and type of computing power available can and will (if given enough opportunity) discover different patterns and heuristics in the same problem domain (provided that the problem domain itself is sufficiently complex). And these alternative patterns may very well prove to be superior to ours by any chosen metric (note how for the time being we excluded the very important questions of whether the agents have the same _goal_ in the environment. We will tackle that question later).

Let's pause here for a second. What we have posited above is that the only things that are "true" or "real" are the environment and the goal. The actual knowledge and strategy of achieving this goal - are always relative to the agent at play. In other words, the idea of Knowledge only makes sense in the context of a given Knower.

Here the reader, struck by the outrageous idea of the ultimate relativity of any knowledge, may ask: but what about the fundamental patterns of mathematics? Aren't math theorems "true" regardless of whether a human or a computer is doing the math? Wouldn't aliens know π is a special number because the relationship between the diameter of a circle and its diameter is a "real" thing? And what about the basic laws of physics? Isn't the discovery of Planck Constant a "real" discovery that makes sense and has value for any kind of mind in this universe?

The answer here, I'm afraid, is not as simple a "yes" as it seems.
We will put the Platonic discussions about whether math is discovered or invented aside. I don't have anything novel or useful to say in that regard. But let us assume that Pi does have a real significance. So there

[diagram]

truthfulness vs. usefulness

inherent complexity of a problem domain scale
from tic tac toe to full universe and beyond

the knower vs. the known

cognitive lens

[/diagram]

/// tic tac toe. consider chess.
/// rulliad
///underpromotion

//continuum on how simple the problem domain is. //

This is a general principle that applies to almost every practical problem domain, with pure mathematics being possibly the only exception. And even there - while the patterns human can discover and prove as theorems are still "truthful" for machines or other minds operating within the same formal system, these patterns may not be "useful" to them in the same way. And other minds may be able to discover other true patterns that we wouldn't be able to comprehend.

The bitter lesson may feel humiliating, or diminishing our value, but it doesn't have to be this way. The only thing it diminishes is our false and damaging exeptionalist sentiment when it comes to intellectual work.

Let me illustrate this point but switching our attention from solving abstract problems in abstract spaces, to solving a very concrete problem of locomotion.  We all take it for granted that moving one foot in front of the other (a.k.a. running) is an optimal strategy of getting from A to B for a human (without the aid of tools). It's not the only strategy: we can crawl, we can hop, some of us can walk on our hands. But walking or running is clearly the best way (if we are travelling on land). However this idea of moving one foot in front of the other - would be ridiculous for an organism or mechanism of a different shape and physical configuration.

For a bird - flying would be faster. A snake doesn't have any feet to put in front of each other. A centipede wouldn't get very far by moving only two legs. And cars can get from A to B more efficiently by utilizing a wheel.

No matter what key metric you choose for evaluating locomotion quality (speed, energy efficiency, quitness... etc.), there is always going to be a way of improving that metric beyond the level of human capability - and that way will most likely not involve legs.

But in the context of locomotion we don't take this fact to seriously, we never had false exceptionalist assimptions that "moving one foot in front of the other is best" heuristic was a universal rule of space. It's quite clear that our preferred heuristic is saying much more about our anatomy than about the nature of space.

I want to emphasize that the fact it's not universal doesn't make this heuristic less valuable to us. Neither does it render the process of discovering better human heuristics obsolete. When the [Fosbury Flop](https://en.wikipedia.org/wiki/Fosbury_flop) was discovered and popularized in the 1960s - it represented a genuine progression in the sport of high jumping. Nobody looked at it and said "oh, this isn't remarkable or valuable because Kangaroo rats can jump so much higher relative
the their body size and they do it using a very different technique".

The key insight here is that in sports it was always clear that the actor was a part of the problem space. The problem space in high jumping is how high can unassisted humans jump, not how high anything can jump.

The good thing about jumping or running is that we were never under the illusion that we as humans were exceptional in it in some absolute sense. Lots of things jump around. And if we want to design a system that can jump higher - we would get lots of ideas of different methods from human and non-human jumpers.

Now when we go back to thinking tasks - things tend to feel different. For all we know Kangaroo rats don't write poetry and don't play chess. And the lack of diversity in observable methods of doing intellectual and creative labour led us to believe that our way of doing it was _the_ way.

Now as capable AI systems are coming along - we are faced with the reality that "we were part of the problem" all along. 
