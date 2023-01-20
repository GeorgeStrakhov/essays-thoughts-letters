# Gods have to play dice


##### _problems and principles of designing artificial decision-makers_


---


> "It is a profoundly erroneous truism, repeated by all copy-books and by eminent people when they are making speeches, that we should cultivate the habit of thinking what we are doing. The precise opposite is the case. Civilization advances by extending the number of important operations which we can perform without thinking about them"
> 
> Alfred Whitehead "Introduction to Mathematics", 1911


> "Oh, this business we've got now - it's been going on for a long time now, not just since the last war. Maybe the actual jobs weren't being taken from the people, but the sense of participation, the sense of importance was."
> 
> Kurt Vonnegut "Player Piano", 1951

The story of human progress is the story of outsourcing the burden of our action, while retaining the sense of our agency. First, we did it with the burden of physical exertion (a.k.a. “The Industrial Revolution”). Today, we are almost done with outsourcing the burden of remembering, sensing and computing (a.k.a. “The Information Revolution”). Next in line (and very much already on the way) are the burdens of directing one's attention, expressing oneself creatively and, finally, the burden of making decisions[^1]. The last shift - outsourcing the burden of decision-making (let's call it “The Autonomy Revolution") - is the trickiest emotionally, because it is not easy to convince yourself that you are still in control, when decisions are increasingly being made by someone or something else.


![drawing](./img/diagram-1.svg)

The problem is not new: the fact is - we've been losing agency all along. Technology is and has always been, an agency sink for humanity[^2]. The moment you outsource action, you also inevitably outsource some portion of your agency. But, until recently, it was easy to ignore.

For example, think about driving. The fact that you don't need to walk there yourself, doesn't change the fact that you are still in control of where you are going, right? Not entirely. The moment you opt for going by car instead of walking, you are trading the extension of the distance you can cover for limiting the types of places you can go to, and the kinds of paths you can take there. Over time cars have an effect on the growth of the road network and the rise and fall of cities, influencing not only where most people can go, but also where they would want to go and even where they can think of going. With the car and other mechanical extensions, the loss of agency is subtle and takes a while. We also maintain the illusion that we are free to have these mechanical extensions at our disposal, but not use them. For example, when buying your first car you may imagine (like I did), that you would still walk most of the time and only use the car for longer trips. This, however, is highly unlikely.



* First, simply having an option to drive to the larger shop a little further away makes walking to the smaller one nearby feel like a sacrifice that you need a special reason for. What was a default choice (or even non-choice) becomes a special choice.
* Second, owning a car will likely end up influencing where you live. As you move to the suburbs, walking or cycling to work would no longer be a viable option.
* Third, on a longer timescale, the rise of car usage often renders neighbourhoods unwalkable (most of the US being a notable example), hence influencing not only your own choices, but also those of others around you.
  

Still, the partial illusion that the choice to drive or not is still in your hands is so powerful that it helps you ease into the idea of driving as your default mode of getting around.

As we've seen from this example, any time we use technology there is a trade-off, a price to pay. But how much agency are you willing to surrender in exchange for outsourcing some of the work and/or scaling some of the impact? If we tried to solve this question consciously every time we interact with technology, we would probably get very confused and paralyzed. Luckily, most of the time, we are not fully aware of the trade-off that we are engaging in when we choose cars (or other mechanical extensions). And in any case, the trade-off mostly feels like it's worth it in the end: in the case of driving, the extension of the range of possibility of where (and when) you can go feels like it more than compensates for the reduction of the density of the possibility space and the partial loss of the joy of walking.

However, when we get to the idea of computers making decisions for us, things start getting a little uncomfortable, especially for some types of decisions.

Let's consider the following scenarios and hypothetical "common sense" reactions to them[^3]:



* _“An algorithm making decisions about which verified taxi driver is best positioned to take me where I need to get to? Yes please!”_

* _“An algorithm making decisions about which route I should take in the light of current traffic conditions? Sure, as long as I am still in control and can at any point disagree and take a different turn.”_
_
* _“An algorithm finding the best deals for me and using chat to negotiate further discounts on my behalf? Sure. But wait, does this mean that people who can afford better algorithms will always have more favourable conditions?_[^4]_”_


* _“An algorithm making decisions about what I should watch next? Sure, as long as it actually shows me something I'd like to see. But wait, does it also influence my taste over time and so in a sense deciding what I should like? That's creepy.”_

* _“An algorithm making decisions about when and how much I should sleep, eat, drink, exercise? Sure, as long as it does it in the best interest of my health and wellbeing, according to the most advanced medical science of the day. But wait, through influencing my diet, sleep and hydration it inevitably changes my mood and, over the long run, personality... hopefully in a positive way, but who knows?”_

* _“An algorithm making decisions about who I should consider dating? Sure, as long as it helps me find a more suitable partner in life and experience fewer heartbreaks. But wait, does that mean algorithms are effectively breeding us? What traits are they breeding for? Are humans just the reproductive organs of technology?”_ 

* _“An algorithm making decisions about whose life is worth more in an unavoidable high speed car collision? Not too sure about that, but the decision has to be made and humans can't consciously make it on the spot (things happen too fast). So as long as the ethical grounds for these decisions are clear... I guess it's ok. But wait, does this mean that the ethical code in a self-driving car's software has to be adapted based on the culture of distribution (in some cultures the lives of seniors are popularly considered more "valuable" than the lives of teenagers and in others it's the opposite)? Should the ethical code differ depending on the car brand? Or should the ethical code be personalised for each owner, with the car salesman asking (or testing for) your personal ethical code, so that they could set up the car accordingly, before they deliver it to you? But will you then be held responsible for the car's decision in court? What a mess!”_

* _“An algorithm making decisions about the best treatment for a critically ill person in a time-constrained environment, based on the available data about this patient and analysis of millions of anonymised medical histories, but without an explainable diagnosis? Hmm, maybe OK, as long as the outcome is statistically better than with our best doctors. But wait, does that mean that the profession of a doctor will slowly disappear over time and we get back to praying to our (Digital) Gods for cure, without understanding the underlying principles?”_

* _“An algorithm making death penalty decisions in court cases, based on law and evidence? Hell, no. Just no. Bad idea. Don't go there. Back off now.”_

While the list is incomplete and hypothetical “common sense” reactions subjective, it’s clear that the emotional and rational considerations surrounding giving up agency to an algorithm would vary a lot, depending on the context and scenario. But why? Why are we OK with algorithms making some decisions for us, but not others? One way to conceptualise this is to think about each scenario in terms of two key variables:

1. **Cost of mistake** - perceived "cost" of making a bad decision. Comprising how consequential the decision seems to be and how irreversible the decision seems to be.
2. **Cost of deliberation** - how hard it is to make the decision of quality and in relevant time by oneself, without the algorithm. Comprising the cost and ease of obtaining the necessary information and processing it in time for the decision to be useful. Processing may be difficult due to the amount of computation required (vs. available time and amount of information) or due to ethical ambiguity.


![drawing](./img/diagram-2.svg)

It's interesting to note that the actual level of performance of the algorithm, while clearly important, does not seem to have an overwhelmingly strong direct effect on how we feel about outsourcing our agency to it. This is somewhat counterintuitive. One would assume that the more demonstrably competent another agent is, the more emotionally comfortable we will be outsourcing agency to them. But it doesn't seem to always work this way for us, mere irrational humans. Both in medicine and in politics, for example, we are routinely trusting our fates not to the most provably competent agents, but to those who are more charismatic, to those who talk more convincingly and to those who make us feel that they are just like us.

The last point, which we can broadly define as "relatability", is very important. Public officials seeking electoral success have known and used this trick for hundreds of years: if you want people to trust you with making decisions for them - make them feel that you are "one of them" and in many ways very much like them. This works because humans are innately wired to be more at ease with those who seem to be like them[^5]. We can try to unpack the psychological inner works behind this bias a little further:



* "If you are like me, it's easier for me to like you"[^6] 


* "If you are like me, you are more likely to make similar decisions to the ones I would have made myself, i.e. decisions in my interest"[^7]


* "If you are like me and you end up making a mistake, I'll find it much easier to forgive you"[^8]
Forgiveability also has an opposite twin that seems to be equally important: blameability. If we know we can blame someone for making a mistake - we are more likely to feel ok about outsourcing responsibility to them. Equally, when we can't really blame somebody (like children), we feel very uneasy about outsourcing decision-making to them (even if we can forgive them easily) - because we feel that ultimately the blame and responsibility will still be on us if something goes wrong.

So far, we've uncovered six general principles that govern how comfortable people are with outsourcing agency to others (including algorithms) in a certain situation:

1. The lower the perceived **cost of mistake**, the easier it is to outsource agency.
2. The higher the **cost of deliberation**, the easier it is to outsource agency.
3. The more **competent** the other agent seems to be (as compared to me), the easier it is to outsource agency to them[^9]

4. The more **relatable** the other agent is, the easier it is to outsource agency to them.
5. The more **blameable** the other agent is, the easier it is to outsource agency to them.
6. The more **forgivable** the other agent is, the easier it is to outsource agency to them.


![drawing](./img/diagram-3.svg)

The first three elements of this model (cost of mistake, cost of deliberation, perceived relative competence) are mostly determined by the problem domain itself, together with the inner workings and physical constraints of each agent. This part of the list is about performance.

The last three elements (relatability, blameability, forgivability) are mostly determined by the biases, emotional predispositions, context, socio-cultural norms and interfaces through which the agents interact. This part of the list is much more about attitude and appearance than about performance.

Now let's try to apply these principles to the challenges of designing autonomous algorithmic decision-making systems that people will be more comfortable outsourcing agency to. Note that I'm deliberately not touching here the extremely important ethical question of _whether_ it's a good idea to design such systems. This is a topic for a separate conversation, concerning ethics. And since ethics are fundamentally personal, every designer will have to answer this question for themselves. Some may completely refuse to design systems that "ease" people into outsourcing even more agency. Others may embrace the challenge. Most designers will probably settle for a more nuanced approach where the decision would depend on the nature of the problem domain, and the system itself. But for the present conversation, I'd like to invite the reader to accept that the world is going in a direction where humans will outsource more and more decisions to artificial agents, whether we like it or not. Hence, the practical challenge of designing such systems is upon us and needs to be better understood.

So how can we design a decision-making system that more people will be happy to outsource agency to? Our 6D working model tells us that we should first design algorithmic-decision-making solutions for problem domains where:



* the cost of mistake is relatively low
* the cost of human deliberation is relatively high
* the performance that AI can achieve is demonstrably high, compared to a human

Navigation is a perfect example of such a problem domain. Mistakes are rarely fatal. Cognitive overhead for the human is high and algorithms can do really well in tasks that involve finding the best route with predictive traffic analysis built-in and a lot of readily available real-time data to consider. Proving superior competency is also relatively easy: once you follow Google Maps directions and arrive at your destination within a minute of the time predicted by the algorithm at the beginning of the trip - you realize that it knows what it's doing better than you ever can. In terms of the other criteria in our model, Google Maps does ok enough to pass:

* Relatability: high (it talks to you, you visually understand through the interface what it's doing etc.)
* Blameability: high (you can easily blame being late to a meeting on the navigation system's error and it would be broadly socially acceptable)
* Forgiveability: medium (There is a lot of room for improvement here, but even as of right now google maps would give you reasons why it can't navigate you to somewhere as quickly as expected - traffic conditions, accidents, road works etc. In essence what Google Maps is doing here is shifting the blame to external circumstances, which helps you come to terms with the algorithm not doing as good of a job as you had hoped for[^10]).
Now let's turn our attention to trickier problem domains, such as full self-driving (FSD) cars on regular roads:

* Cost of mistake: high (2 tons at 100 mph can make a lot of damage and kill a lot of people)
* Cost of deliberation: seems low once you've learned how to drive yourself (even though in reality it's very high, especially in extreme scenarios, where you can't possibly consciously make the "right" decision in a split-second)
* Perceived relative competence of the algorithm: mostly on par with humans
* Relatability: low (“Doesn’t look like me, doesn’t reason like me, I don’t know what it knows and how it does what it does”)
* Blameability: medium (if you crash into a pedestrian and injure them while FSD was driving - most people would find it hard - as of right now - to accept that the algorithm is to blame and you are innocent, even if the laws about this were to change tomorrow)
* Forgiveability: low (if the algorithm crashes your car or runs over you, it’s hard to forgive)

This quick analysis helps us get more insight into why most drivers feel so reluctant to let the algorithm do the driving for them. If we wanted to overcome this reluctance, the model suggests a few possible avenues for doing so:

* First, we could try to increase the perceived relative competence of the algorithm, demonstrating either how bad humans are at driving on average[^11], or by demonstrating how good the FSD algorithms are. The trick would be to not focus communication on the "on par with humans" scenarios e.g. that it will stop the low speed parking manoeuvre when a pedestrian gets in the way. These scenarios should be, obviously, taken care of, but that's not where humans would get the radical confidence boost. Instead FSD demonstrations should focus on showing feats of reaction and precision steering that would clearly be unattainable for human drivers, creating perception of radical superiority, rather than parity.

* Second, we could try to increase the blameability of FSD: if, through campaigning and lobbying, somebody made it both socially and legally acceptable to blame the responsibility of bad driving on the driving algorithm, most people would find it much easier to let these algorithms drive for them. In other words, if you can sue them - you can let them do the job.

* Third, we could try to increase relatability. There are obvious ways to do it through design and transparency (and explainability) of rules etc. But there are also more radical and more interesting solutions to this than making cars more cute and FSD rules more transparent. As we discussed previously, relatability is mostly affected by how similar the other agent is to me, the original decision-maker. So ultimately the most relatable and most trusted agent to outsource decisions to - would be myself. In an effort to maximise relatability we can try to change the mental model of who is doing the driving: from "it's a clever FSD algorithm" to "it's just a digital twin of myself as a driver". Imagine that for each driver we could take a pre-trained FSD solution and then customise (or uptrain) it based on the recorded performance of each particular driver. The recorded performance can be obtained from driving in a simulator (where we can also model extreme scenarios), or it can be obtained from an initial few days of hand driving by the car owner, or even from historical driving data, recorded by the owner’s previous cars. Armed with this data, we can create a "digital driver twin" of the user and let that twin do the driving - which would potentially feel very different for the user.

Now let's look a little closer at the "attitude and appearance" side of our 6-dimensional working model. The model tells us that we should strive to design artificial decision-makers that are more relatable, more blameable and more forgivable. And there is a lot of work already going in this direction. Recent focus on explainability of our AI solutions is aimed primarily at maximising relatability ("if we understand how it thinks, we can feel more comfortable trusting it") and blameability ("if we understand how it came to the wrong conclusion, we can pinpoint the flaw and take appropriate corrective action"). As for forgivability, there is a lot of effort in robot design to make robots look cute (more like children, more forgiveable). But in the domain of software, I'm not aware of any specific design efforts concentrating on forgiveability. This could be an exciting new horizon for UX research and innovation for AI designers. Simple UX "hacks", such as apologising for wrong answers, could make a big emotional difference. Another interesting avenue for increasing forgiveability would be to create more transparency of confidence levels: it's easier to forgive a computer getting it wrong if it had communicated to you in advance that it was only 55% confident and had given you some time to intervene before committing to the decision. We can call this design pattern "smart defaults" and it probably represents a larger family of solutions where agency is not completely transferred from a human to a machine, but instead it is shared between them (i.e. the job of AI is to select the most appropriate default and expose confidence levels and reasoning, the job of the human is to intervene if they deem necessary[^12]).

"Smart defaults" and other solutions of the "shared agency" kind have a lot of potential. And they are already widely used: navigation apps, that we have discussed earlier, give one example. YouTube autoplaying the next suggested video is another example. The devil, however, is in the details. Setting smart defaults is very consequential, because lots of people just go with the defaults. So we need to pay very close attention to the inner workings of the model behind. What should the "smart default" be optimised for? And what data should it use to do so? There is a great range of potential answers here. In the case of autoplaying recommended YouTube videos, you can optimise for the longest eventual stay on the platform, you can optimise for the the user's mental health, you can optimise for discovery of new content outside of the user's "bubble", you can also explicitly ask the user what they would like their defaults. This last option is particularly interesting because for a lot of people their conscious, considered decision of what they want the algorithm to show them more of would be different from what they would impulsively click on. In other words, should we be optimising content recommendations for the lizard brain or for the neocortex? The case of autoplaying videos may sound trivial, but exactly the same logic can be applied to much more consequential issues - from self-driving cars to electronic voting systems.

The case of electronic voting is particularly interesting to think through. Imagine how different a democratic political landscape would be if we made it mandatory for all people to vote and went through a one-time procedure of everyone registering their "default" rules and patterns that should be followed unless they intervene. For example, someone can decide to always vote Republican, someone else can choose "random" or “against all” as their default. One could also set the rule to always vote the same as their trusted friend who digs politics, or the same as a certain celebrity they like etc. Once the initial set-up is done, whenever the next election comes, everybody receives a notification with their "default" and they have 3 days to change it if they choose so. Then all the votes are counted and the election decided[^13]. We can also imagine a more extreme version of this scenario that would not require an explicit initial definition of the "default" rule by every voter. We could use each voter's available data (age, gender, education, neighbourhood, previous voting records etc.) and use machine learning to predict how they would likely vote in the current election, based on the voting behaviour of other people like them, and set this as their default (that they would, obviously, still be able to change within the 3-day period, thus also providing feedback needed to further refine the prediction system). There are lots of details in there to be worked out, but at the fundamental level all these hypothetical scenarios are 100% technologically possible today and they would lead us to vastly different election outcomes. One can argue that a "smart default"-enabled democracy would not only be easier, but would also be much more fair and representative, compared to what we have today. But thinking about it, many people would still feel uneasy. Let's try to get deeper under the skin of this uneasiness to understand the limits of our working model.

The uneasiness that we feel when considering "smart-default"-enabled, ML-powered voting systems is only partially related to the idea of sharing our agency with an algorithm. The larger part of the discomfort seems to be coming just from thinking about any kind of significant change to such an important (and loaded) system as voting. When confronted with a need to make a really hard, complex, consequential decision, the thing that humans like doing the most - is finding a way to not make a decision at all. This aversion to decision-making can take many forms. Sometimes we simply postpone it again and again. Sometimes we find all sorts of post-rationalized reasons for why it's better to leave things as they are. One of the most common psychological mechanisms we like to employ to avoid making decisions is to pretend that we didn't have the power to make them in the first place. This is why fate, or God's will, is such an appealing idea. If I think I don't have any agency to start with, then I don't need to worry about exercising it, or sharing it[^14].

The ultimate example of this is tossing a coin to make a life-and-death decision. In such an extreme case our model seems to almost get inverted. What can be less competent, less relatable, less blameable than a coin? One possible explanation of this phenomenon is that when the perceived costs of deliberation and mistake reach certain subjective thresholds, human beings tend to enter a special state where all they want to do is just get rid of the need to make a decision themselves, at all costs and as quickly as possible. In this state we are absolutely ok with (and maybe even prefer) outsourcing our agency to the most dumb, unrelatable, random and unexplainable decision-making agents. The mysterious, uncontrollable, chaotic nature of various methods of divination for making important decisions (and coin toss is just the simplest version of divination) are appealing to humans because they signal that some higher power of ultimate competence (nature, god, fate, tradition) is actually making a call for them, which feels extremely liberating.

We love freeing ourselves from the burden of decision-making, as long as the burden is shifted to what we perceive as a power orders of magnitude more competent than we are: be that a God who has a plan, a prophet, a supreme leader, the wisdom of the crowds or the wisdom of tradition. But whatever this entity is, it has to work in mysterious ways. Fate somehow has to be fuzzy. The strangeness, the randomness is, in this case, a virtue - because it is seen as a proof that the competence of the superior decision-maker is of a completely different level. Understanding something and trusting it blindly don't work well together.

The fact that humans actually love shifting agency to “higher powers” in high-stakes scenarios makes one wonder, whether digital dictatorship could actually be very easy for humanity to fall into (if we reach a certain threshold). It seems quite possible that in the longer run, the suspicion with which we view artificial decision makers today could give way to worship and gratitude for delivering us from the computationally intensive and emotionally taxing burden of choosing our own fate. Maybe AGI overlords won’t even have to have their own agendas in order to achieve overwhelming power over us, because we will be all too keen to surrender the power to them voluntarily.


![drawing](./img/diagram-4.svg)

As we can see from this preliminary exploration, three vectors of artificial decision-makers design are emerging:

1. First, we can make our artificial agents completely autonomous, demonstrably super-competent, relatable, forgivable and blameable. Our relationship with such an agent will be in many ways like our relationship with another human who is performing a specialist function for us.
2. Second, we can make our artificial agents only partially autonomous, creating a model of shared agency (e.g. "smart defaults" pattern). Our relationship with such an agent will be similar to our relationship with service dogs (or other smart animals - who can be autonomous and perform a valuable function, but are not considered independent).
3. Third, we can make our artificial agents completely autonomous and completely unrelatable - essentially employing randomness (or rule of precedent or anything else inside a black box) to assume the agency or to "pass it on" further to chance, fate, God or tradition. Our relationship with such an agent will be similar to our relationship with an oracle or a God (who “know better”, but act in mysterious ways that we don’t and shouldn’t understand).

These three vectors can be employed simultaneously in the design of one agent. In this case, the agent would switch modes, depending on the task and situation. For example, an FSD-enabled car can operate in "autonomous-relatable-blameable" (“specialist human mode”) mode when it's doing an automated parking manoeuvre. It can switch to "shared-agency-smart-defaults" mode when the driver is operating it on the highway (“service dog mode”). And in a high-speed unavoidable collision situation where there is no clearly good outcome and no way in which a human can intervene intentionally, FSD may be better off switching to the "autonomous-unrelatable-fate" mode (“god mode”) - effectively using randomness to pass on responsibility to chance (just like humans do in situations where things are completely beyond their control).

This last switch to the "fate" mode may seem like a cop-out. And in a way, it is. But the idea of complete intentionality with unlimited ethical precision can be an even more dangerous utopia than consciously accepting and embracing chance in situations where chance clearly rules. No matter how smart or quick our decision-making agents can be, there will always be a limit to their ability to judge a situation - either because the speed is too high, the sensor precision too low, or rules too fuzzy. Forcing our artificial decision-makers to still make an intentional choice in such a situation (or even simply interpreting their choice as intentional) creates a perception that these agents made a mistake, while operating in the same way as normal. This perception undermines our trust in them in every other situation, where they are perfectly capable of acting intentionally and deciding well on our behalf. There is a massive emotional difference between “letting God decide” and “allowing the faulty machine to make a terrible mistake”, even though in practice the two can be the same. To this end, deliberately and explicitly placing the responsibility into the hands of chance (a.k.a. fate) can be a great strategy. To clearly position the locus of ultimate responsibility in unsolvable situations, we can imagine car manufacturers actually collaborating with the Church (or any other relevant religious authority). One can imagine an odd, but not entirely unrealistic scenario where the Church would certify (or bless) custom-made quantum random-number generators that will take over responsibility in an event where the regular algorithm can’t find any solution that is clearly better than the others. Depending on whether you are a Christian, a Buddhist or a science-adhering atheist you could order a version of your car with “fate” devices certified, certified by different authorities (for example, Catholic church, Dalai Lama’s office or an MIT quantum computing lab).

Where should we draw the line? How do we decide when the mode needs to switch to "random" (a.k.a. fate)? How do we generate true randomness and ensure that it is indeed as random as it can be, without any biases? How does the moment of switching change over time as technology improves? What level of confidence is sufficient for the model to be considered as acting intentionally? How do we think (socially, legally and culturally) about responsibility when the autonomous artificial decision-making agent is making a choice for us in "fate" mode? 

All these questions, and many others need to be considered if we are ever going to intentionally implement "fate-mode" in practice. But it does seem clear, that as the autonomy revolution advances, as technological divination improves, as we construct our digital oracles and they slowly ascend to the position of Gods, they too will need to learn when and how to surrender to chance, how to let go of the feeling of responsibility. And humans will need to re-learn how to be ok with it. Throughout most of history and across vastly different cultures, we were perfectly fine with surrendering to chance (disguised as higher power[^15]). Only over the last couple of centuries did we rebel against this idea. This rebellion was so powerful, that when randomness, via Heisenberg's uncertainty principle, made its way back into the fundamentals of physics, most people found it incredibly hard to take. Einstein famously struggled and refused to believe that God could play dice with the Universe. But the more we find out about the world and about ourselves, the more we realise that randomness may indeed be a fundamental feature of the Universe, or at least of how we perceive it. Carl Jung used to point out that as we try to expel Gods and demons from nature, they inevitably re-surface within ourselves. Most likely we will also have to find room for the demons in our own creations that we are starting to surrender our agency to. Because one way or the other, all Gods have to play dice. And as God-builders, we have a responsibility to teach them how to do it well.

---
### **footnotes**

[^1]:
     One might ask if these are really burdens to be outsourced or luxuries of conscious life to be enjoyed. This seems to be a question of the point of view and personal ethics (and this question can be reasonably applied all the way back to physical labour as well). What is clear, however, is two things:
(1) Sensing, computing, thinking, directing attention, creatively expressing oneself and making decisions all take up considerable amounts of mental and physical energy, which means that from the standpoint of evolution they are indeed expenditures to potentially be optimized. (2) Today people are, in fact, happily outsourcing all of these to a significant degree and even paying for it. Which means that lots of people would rather avoid doing it, when given opportunity, hence, by definition, for many people it's indeed a burden.

[^2]:
     This may serve as a potentially useful broad definition for technology.

[^3]:
     It's really interesting to think about how these "common sense" reactions are not fixed and universal, but in fact very dependent on the time, culture, demographics etc. The ones listed here are my over-generalizations and abstractions of the modern "western", urban millennial mind in 2022, but clearly the reactions would be very different for an elderly Japanese painter at the end of the 20ths century, for example.

[^4]:

     This is not dissimilar to the current situation with lawyers. Whoever can afford a better one is more likely to win a court battle - which, one could argue - is ethically problematic.

[^5]:
     There are obviously good evolutionary reasons for why we would be wired this way.

[^6]:

     General positive emotional predisposition (bias) influences all other more special attitudes significantly. And readiness to outsource responsibility is no exception.

[^7]:

     This reasoning is obviously flawed: even if you make decisions in a similar fashion to me, it doesn't mean that your decisions will be in my interest, because we are in two different positions. Still, most people fall for it and assume that if the decision-maker is similar to them, the outcomes will be desirable for them.

[^8]:

     Because we all have powerful psychological mechanisms built-in for forgiving ourselves and for distorting reality to make us feel right or justified or at least coherent, even when we are not. These mechanisms seem to partially transfer to people who we perceive as being similar to us.

[^9]:

     While we mentioned earlier that competence doesn't play as big a role as you'd think it should from a purely rational perspective, it still obviously matters to some degree and shouldn't be ignored.

[^10]:

     As we will see shortly, blameshifting (or, to be more precise, blame locating) is one of the key strategic considerations when designing an autonomous or semi-autonomous decision-making system.

[^11]:

     In fact comparing FSD with average drivers won’t be enough, because average human drivers consider themselves to be much better than average. So what FSD demonstrations need to focus on is how terrible a driver you are personally - thus helping you understand why it’s better for you individually to surrender responsibility to a superior autonomous agent.

[^12]:
     It’s interesting to note that as your reliance on the algorithm grows, the types of situations where you would consider intervention to be necessary would, probably, go down.

[^13]:
     "Defaults" don't have to be set once and for all, but can be updated as the person's attitudes change. And "defaults" don't have to look like simple rules. They can be represented by an ML model that would predict your next vote, based on your previous voting history etc.

[^14]:
     This outsourcing of responsibility to higher powers makes things easier not only personally, but also socially. Others can't blame you if they know that it's not your call. There is a great potential for designing artificial decision-making systems that exploit this idea. For example, one could imagine how liberating it would feel to have an AI personal boss who is in charge of your calendar and what you should focus on. When you initially set your boss up you can instruct it on the principles and rules and what to optimise for, but then, once the initial set-up is done - the boss is in charge and you do what the boss says. So when friends ask you out, or when an interesting but not essential new project comes up - you can consult the boss, get a "no" and tell people that you'd love to do it, but sadly your boss doesn't allow you to.

[^15]:
     Or, in a different, but equally valid interpretation, -  higher power, disguised as chance. 
