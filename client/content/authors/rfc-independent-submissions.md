# Independent Submissions

The Independent Submission Stream allows RFC publication for some documents that are outside the official processes of the [IETF](https://www.ietf.org/), [IAB](https://www.iab.com/), and [IRTF](https://www.irtf.org/) but are relevant to the Internet community and achieve reasonable levels of technical and editorial quality. [RFC 8730, “Independent Submission Editor Model”](/info/rfc8730/), as updated by [RFC 9280](/info/rfc9280/), describes the roles of

- the Independent Submissions Editor (ISE) and
- the [Independent Submissions Editorial Board](#independent-submissions-editorial-board), which provides review for the ISE.

The Independent Submissions Editor (ISE) is currently [Eliot Lear](https://datatracker.ietf.org/person/lear@lear.ch), who can be reached at [rfc-ise@rfc-editor.org](mailto:rfc-ise@rfc-editor.org).

#### What sort of documents are independent submissions? {#what-sort-of-documents-are-independent-submissions?}

The Independent Stream covers a number of classes of submissions, including discussions of technologies, options, or experience with protocols; humor; documentation of vendor-specific protocols; introduction of new ideas that may not yet be ripe for standardization; critiques of the IETF process; and a few other areas.

The current independent submissions editor looks at a document through the lens of three questions:

1. Does this specification improve interoperability?
2. Does this document contribute to continuous improvement of the Internet?
3. Does this document provide the community some levity?

Not every submission needs to hit all three points.

#### What are some examples of RFCs published through the Independent Stream that hit at least one of those points? {#what-are-some-examples-of-rfcs-published-through-the-independent-stream-that-hit-at-least-one-of-those-points?}

- [RFC 9446](/rfc/rfc9446/) provides us a retrospective on ten years after the Snowden revelations, how the community reacted, what was accomplished, and what could be done better.
- [RFC 9518](/rfc/rfc9518/) talks about Internet centralization, its impact, and what, if anything, can be done about it.
- [RFC 9405](/rfc/rfc9405/) discusses sarcasm in AI systems, and was written in part by ChatGPT.
- [RFC 9383](/rfc/rfc9383/) specifies the SPAKE2+ augmented password-authenticated key exchange (PAKE) protocol.

#### What other criteria are there for Independent Stream RFCs? {#what-other-criteria-are-there-for-independent-stream-rfcs?}

Documents must be well written, understandable, and appropriate for the readership of the RFC series. They must adhere to any [IANA](https://iana.org/) rules for code point allocation, and in general may not create new IANA registries. Internal implementation descriptions are generally not accepted, nor are foundational formats upon which standards are expected to be built.

#### What if a document isn’t appropriate as an independent submission? {#what-if-a-document-isn’t-appropriate-as-an-independent-submission?}

If a document is not appropriate as an independent submission, the Independent Submissions Editor will attempt to assist the authors to find a more appropriate home. That could be the IETF, the [IRTF](https://irtf.org/), some other standards organization, a blog, or an academic publication. The criteria to be applied is simple: what would best serve the community?

#### What about Intellectual Property Rights (IPR)? {#what-about-intellectual-property-rights-(ipr)?}

An independent RFC should generally provide an open license to implement and deploy some or all of the technology described in the document; text from that document is available to be reused for any purpose.

#### What’s the process? {#what’s-the-process?}

Everything begins with an Internet-Draft. You can use the same tooling that is used by the IETF to create and publish it onto the Datatracker. See [authors.ietf.org](https://authors.ietf.org) for more information about authoring tools.  
The rest of the process is summarized as follows:

1. Submit a draft
2. Fill out the independent submissions template found at the top of this page
3. Submit the template to the Independent Submissions Editor
4. Initial ISE review
5. Commissioned reviews
6. Follow-up ISE review
7. IETF Conflict Review
8. Follow-up ISE review
9. Initial publication decision
10. Submission to the RFC Production Center (RPC)
11. AUTH48
12. Publication

It’s important to note that many drafts do not make it past Step 4, and that every step after submission may be iterated or repeated. For instance, if external review indicates that substantial amounts of work are needed, authors are expected to improve the document in discussions with reviewers and the Independent Submissions Editor.

#### At what stage is a document? {#at-what-stage-is-a-document?}

Information about the current state of an independent submission can be found on the [Datatracker](https://datatracker.ietf.org/) page for that draft.  
![Snapshot of a Datatracker entry for an Internet-Draft that shows the document’s state.][image4]  
Note that a document can sometimes appear to go “backwards” in the process. This is not unusual, indicating that either additional reviews require more work on someone’s part.

#### Who makes decisions about independent submissions? {#who-makes-decisions-about-independent-submissions?}

The Independent Submissions Editor is responsible for making decisions about each submission, in accordance with the guidance set forth in [RFC 4846](/rfc/rfc4846/). The Independent Submissions Editor is appointed by the [Internet Architecture Board (IAB)](https://iab.org/), and serves at their pleasure. Anyone may send comments to the IAB about the Independent Submissions Editor.

The Independent Submissions Editor is ably assisted by the Independent Submissions Editorial Board, who also sometimes perform document reviews.

#### Who reviews submissions? {#who-reviews-submissions?}

The Independent Submissions Editor seeks review of the work through individuals who are knowledgeable about the topic discussed in the draft. Authors are encouraged to submit suggestions, but some reviews will be conducted outside of that list. In addition, anyone is welcome to comment on a draft that is being considered by the Independent Submissions Editor.

#### Where can reviews be found? {#where-can-reviews-be-found?}

![Snapshot of the Datatracker entry for a draft that shows reviews.][image5]  
Unless they have been submitted anonymously, reviews will be found on the Datatracker page associated with your draft.

#### What is IETF Conflict Review? {#what-is-ietf-conflict-review?}

In general, submissions should not conflict with IETF work or established best practices. [RFC 5742](/rfc/rfc5742/) provides the Internet Engineering Steering Group (IESG) the opportunity to comment about whether this is the case. Most of the time a document will not get to the stage of the IESG even being consulted if such a conflict is likely. If the IESG determines that there is a conflict of some form, the ISE will attempt to work with authors and the IESG to resolve it satisfactorily.

#### How is a decision made? {#how-is-a-decision-made?}

The Independent Submissions Editor takes into account the preponderance of reviews, as well as the IESG’s input, in making a publication determination as to whether the document can be published. If it cannot, in some cases, this may be rectified with additional work by the authors. In other cases, the publication decision is final.

The Independent Submissions Editor reserves the right to not publish any work up until the point that it has been released as an RFC.

#### What happens if a work is declined? {#what-happens-if-a-work-is-declined?}

Authors may seek further review of their work, either by the Independent Submissions Editor or by the IAB, who may choose to review a document or not. If it does, then the IAB will advise the Independent Submissions Editor as to their views. In all cases, the Independent Submissions Editor makes the final decision.

#### Can an Independent Submission be changed once it is published as an RFC? {#can-an-independent-submission-be-changed-once-it-is-published-as-an-rfc?}

No. RFCs are all but immutable. However, anyone may submit an erratum about any RFC, and those that are accepted will be noted on the RFC Editor web page.

#### More questions? {#more-questions?}

We are happy to answer any questions you might have. Contact us at [rfc-ise@rfc-editor.org](mailto:rfc-ise@rfc-editor.org).
