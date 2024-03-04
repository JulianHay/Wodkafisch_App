import React from "react";
import {
  ColumnContainer,
  RowContainer,
  Section,
} from "../../../components/containers";
import { Text } from "../../../components/text";
import Image from "next/image";

const TermsAndConditions = () => {
  return (
    <Section>
      <RowContainer>
        <ColumnContainer style={{ width: "60%", alignItems: "center" }}>
          <Text
            text="Terms and Conditions"
            fontSize={30}
            fontWeight="bold"
            style={{ margin: 40 }}
          />
          <ColumnContainer style={{ marginBottom: 40 }}>
            <p>
              These terms and conditions (&#8220;Agreement&#8221;) set forth the
              general terms and conditions of your use of the{" "}
              <a href="http://www.wodkafis.ch">wodkafis.ch</a> website
              (&#8220;Website&#8221; or &#8220;Service&#8221;) and any of its
              related products and services (collectively,
              &#8220;Services&#8221;). This Agreement is legally binding between
              you (&#8220;User&#8221;, &#8220;you&#8221; or &#8220;your&#8221;)
              and this Website operator (&#8220;Operator&#8221;,
              &#8220;we&#8221;, &#8220;us&#8221; or &#8220;our&#8221;). If you
              are entering into this agreement on behalf of a business or other
              legal entity, you represent that you have the authority to bind
              such entity to this agreement, in which case the terms
              &#8220;User&#8221;, &#8220;you&#8221; or &#8220;your&#8221; shall
              refer to such entity. If you do not have such authority, or if you
              do not agree with the terms of this agreement, you must not accept
              this agreement and may not access and use the Website and
              Services. By accessing and using the Website and Services, you
              acknowledge that you have read, understood, and agree to be bound
              by the terms of this Agreement. You acknowledge that this
              Agreement is a contract between you and the Operator, even though
              it is electronic and is not physically signed by you, and it
              governs your use of the Website and Services.
            </p>
            <div>
              <Text
                text="Table of contents"
                fontSize={18}
                fontWeight="bold"
                style={{ marginTop: 10, marginBottom: 10 }}
              />
              <ol>
                <li>
                  <a href="#links-to-other-resources">
                    1. Links to other resources
                  </a>
                </li>
                <li>
                  <a href="#prohibited-uses">2. Prohibited uses</a>
                </li>
                <li>
                  <a href="#intellectual-property-rights">
                    3. Intellectual property rights
                  </a>
                </li>
                <li>
                  <a href="#limitation-of-liability">
                    4. Limitation of liability
                  </a>
                </li>
                <li>
                  <a href="#indemnification">5. Indemnification</a>
                </li>
                <li>
                  <a href="#severability">6. Severability</a>
                </li>
                <li>
                  <a href="#dispute-resolution">7. Dispute resolution</a>
                </li>
                <li>
                  <a href="#changes-and-amendments">
                    8. Changes and amendments
                  </a>
                </li>
                <li>
                  <a href="#acceptance-of-these-terms">
                    9. Acceptance of these terms
                  </a>
                </li>
                <li>
                  <a href="#contacting-us">10. Contacting us</a>
                </li>
              </ol>
            </div>
            <Text
              id="links-to-other-resources"
              text="Links to other resources"
              fontSize={18}
              fontWeight="bold"
              style={{ marginTop: 20, marginBottom: 10 }}
            />
            <p>
              Although the Website and Services may link to other resources
              (such as websites, mobile applications, etc.), we are not,
              directly or indirectly, implying any approval, association,
              sponsorship, endorsement, or affiliation with any linked resource,
              unless specifically stated herein. We are not responsible for
              examining or evaluating, and we do not warrant the offerings of,
              any businesses or individuals or the content of their resources.
              We do not assume any responsibility or liability for the actions,
              products, services, and content of any other third parties. You
              should carefully review the legal statements and other conditions
              of use of any resource which you access through a link on the
              Website. Your linking to any other off-site resources is at your
              own risk.
            </p>
            <Text
              id="prohibited-uses"
              text="Prohibited uses"
              fontSize={18}
              fontWeight="bold"
              style={{ marginTop: 20, marginBottom: 10 }}
            />
            <p>
              In addition to other terms as set forth in the Agreement, you are
              prohibited from using the Website and Services or Content: (a) for
              any unlawful purpose; (b) to solicit others to perform or
              participate in any unlawful acts; (c) to violate any
              international, federal, provincial or state regulations, rules,
              laws, or local ordinances; (d) to infringe upon or violate our
              intellectual property rights or the intellectual property rights
              of others; (e) to harass, abuse, insult, harm, defame, slander,
              disparage, intimidate, or discriminate based on gender, sexual
              orientation, religion, ethnicity, race, age, national origin, or
              disability; (f) to submit false or misleading information; (g) to
              upload or transmit viruses or any other type of malicious code
              that will or may be used in any way that will affect the
              functionality or operation of the Website and Services, third
              party products and services, or the Internet; (h) to spam, phish,
              pharm, pretext, spider, crawl, or scrape; (i) for any obscene or
              immoral purpose; or (j) to interfere with or circumvent the
              security features of the Website and Services, third party
              products and services, or the Internet. We reserve the right to
              terminate your use of the Website and Services for violating any
              of the prohibited uses.
            </p>
            <Text
              id="intellectual-property-rights"
              text="
              Intellectual property rights
            "
              fontSize={18}
              fontWeight="bold"
              style={{ marginTop: 20, marginBottom: 10 }}
            />
            <p>
              &#8220;Intellectual Property Rights&#8221; means all present and
              future rights conferred by statute, common law or equity in or in
              relation to any copyright and related rights, trademarks, designs,
              patents, inventions, goodwill and the right to sue for passing
              off, rights to inventions, rights to use, and all other
              intellectual property rights, in each case whether registered or
              unregistered and including all applications and rights to apply
              for and be granted, rights to claim priority from, such rights and
              all similar or equivalent rights or forms of protection and any
              other results of intellectual activity which subsist or will
              subsist now or in the future in any part of the world. This
              Agreement does not transfer to you any intellectual property owned
              by the Operator or third parties, and all rights, titles, and
              interests in and to such property will remain (as between the
              parties) solely with the Operator. All trademarks, service marks,
              graphics and logos used in connection with the Website and
              Services, are trademarks or registered trademarks of the Operator
              or its licensors. Other trademarks, service marks, graphics and
              logos used in connection with the Website and Services may be the
              trademarks of other third parties. Your use of the Website and
              Services grants you no right or license to reproduce or otherwise
              use any of the Operator or third party trademarks.
            </p>
            <Text
              id="limitation-of-liability"
              text="Limitation of liability"
              fontSize={18}
              fontWeight="bold"
              style={{ marginTop: 20, marginBottom: 10 }}
            />
            <p>
              To the fullest extent permitted by applicable law, in no event
              will the Operator, its affiliates, directors, officers, employees,
              agents, suppliers or licensors be liable to any person for any
              indirect, incidental, special, punitive, cover or consequential
              damages (including, without limitation, damages for lost profits,
              revenue, sales, goodwill, use of content, impact on business,
              business interruption, loss of anticipated savings, loss of
              business opportunity) however caused, under any theory of
              liability, including, without limitation, contract, tort,
              warranty, breach of statutory duty, negligence or otherwise, even
              if the liable party has been advised as to the possibility of such
              damages or could have foreseen such damages. To the maximum extent
              permitted by applicable law, the aggregate liability of the
              Operator and its affiliates, officers, employees, agents,
              suppliers and licensors relating to the services will be limited
              to an amount no greater than one dollar or any amounts actually
              paid in cash by you to the Operator for the prior one month period
              prior to the first event or occurrence giving rise to such
              liability. The limitations and exclusions also apply if this
              remedy does not fully compensate you for any losses or fails of
              its essential purpose.
            </p>
            <Text
              id="indemnification"
              text="Indemnification"
              fontSize={18}
              fontWeight="bold"
              style={{ marginTop: 20, marginBottom: 10 }}
            />
            <p>
              You agree to indemnify and hold the Operator and its affiliates,
              directors, officers, employees, agents, suppliers and licensors
              harmless from and against any liabilities, losses, damages or
              costs, including reasonable attorneys&#8217; fees, incurred in
              connection with or arising from any third party allegations,
              claims, actions, disputes, or demands asserted against any of them
              as a result of or relating to your Content, your use of the
              Website and Services or any willful misconduct on your part.
            </p>
            <Text
              id="severability"
              text="Severability"
              fontSize={18}
              fontWeight="bold"
              style={{ marginTop: 20, marginBottom: 10 }}
            />
            <p>
              All rights and restrictions contained in this Agreement may be
              exercised and shall be applicable and binding only to the extent
              that they do not violate any applicable laws and are intended to
              be limited to the extent necessary so that they will not render
              this Agreement illegal, invalid or unenforceable. If any provision
              or portion of any provision of this Agreement shall be held to be
              illegal, invalid or unenforceable by a court of competent
              jurisdiction, it is the intention of the parties that the
              remaining provisions or portions thereof shall constitute their
              agreement with respect to the subject matter hereof, and all such
              remaining provisions or portions thereof shall remain in full
              force and effect.
            </p>
            <Text
              id="dispute-resolution"
              text="Dispute resolution"
              fontSize={18}
              fontWeight="bold"
              style={{ marginTop: 20, marginBottom: 10 }}
            />
            <p>
              The formation, interpretation, and performance of this Agreement
              and any disputes arising out of it shall be governed by the
              substantive and procedural laws of Germany without regard to its
              rules on conflicts or choice of law and, to the extent applicable,
              the laws of Germany. The exclusive jurisdiction and venue for
              actions related to the subject matter hereof shall be the courts
              located in Germany, and you hereby submit to the personal
              jurisdiction of such courts. You hereby waive any right to a jury
              trial in any proceeding arising out of or related to this
              Agreement. The United Nations Convention on Contracts for the
              International Sale of Goods does not apply to this Agreement.
            </p>
            <Text
              id="changes-and-amendments"
              text="Changes and amendments"
              fontSize={18}
              fontWeight="bold"
              style={{ marginTop: 20, marginBottom: 10 }}
            />
            <p>
              We reserve the right to modify this Agreement or its terms related
              to the Website and Services at any time at our discretion. When we
              do, we will revise the updated date at the bottom of this page. We
              may also provide notice to you in other ways at our discretion,
              such as through the contact information you have provided.
            </p>
            <p>
              An updated version of this Agreement will be effective immediately
              upon the posting of the revised Agreement unless otherwise
              specified. Your continued use of the Website and Services after
              the effective date of the revised Agreement (or such other act
              specified at that time) will constitute your consent to those
              changes.
            </p>
            <Text
              id="acceptance-of-these-terms"
              text="Acceptance of these terms"
              fontSize={18}
              fontWeight="bold"
              style={{ marginTop: 20, marginBottom: 10 }}
            />
            <p>
              You acknowledge that you have read this Agreement and agree to all
              its terms and conditions. By accessing and using the Website and
              Services you agree to be bound by this Agreement. If you do not
              agree to abide by the terms of this Agreement, you are not
              authorized to access or use the Website and Services. This terms
              and conditions policy was created with the help of{" "}
              <a
                href="https://www.websitepolicies.com"
                target="_blank"
                rel="nofollow"
              >
                WebsitePolicies
              </a>
              .
            </p>
            <Text
              id="contacting-us"
              text="Contacting us"
              fontSize={18}
              fontWeight="bold"
              style={{ marginTop: 20, marginBottom: 10 }}
            />
            <p>
              If you have any questions, concerns, or complaints regarding this
              Agreement, we encourage you to contact us using the details below:
            </p>
            <p>
              <a href="http://wodkafis.ch/contact">
                http://wodkafis.ch/contact
              </a>
              <br />
              <a href="mailto:contact@wodkafis.ch">contact@wodkafis.ch</a>
            </p>
            <p style={{ marginTop: 20 }}>
              This document was last updated on March 12, 2023
            </p>
            <p>
              <a
                href="https://www.websitepolicies.com/?via=madewithbadge"
                target="_blank"
                rel="nofollow"
              >
                <Image
                  width="200"
                  height="25"
                  quality={100}
                  alt="Made with WebsitePolicies"
                  src="https://cdn.websitepolicies.io/img/badge.png"
                  // srcSet="https://cdn.websitepolicies.io/img/badge_2x.png 2x"
                />
              </a>
            </p>
          </ColumnContainer>
        </ColumnContainer>
      </RowContainer>
    </Section>
  );
};

export default TermsAndConditions;