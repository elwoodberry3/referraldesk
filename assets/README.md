# Assets


## System Diagram
Seelye Ford of Kalamazoo                                       # The rooftop. Funds the $200-per-referral program and owns the whole system. Every contact, agent, and referrer lives under this one dealership.
└── Admin Manager                                              # Rooftop-level admin (Adam wears this hat). Sees every agent's contacts and ledger across the store; the only role with full cross-agent visibility.
    └── Sales Agent Portal (Adam)                              # Adam's workspace as a sales agent. Owns all contacts his referrers generate; runs his own ledger, profile, and marketing funnel.
        └── Profile                                            # Adam's account details, payout settings, and branding. Drives how his name and info appear on his funnel and his referrers' portals.
        └── Ledger                                             # Adam's book of business. Every referral he owns, its status (New→Showed→Sold), and the $200 owed/paid total tracked in one place.
            └── New Referral                                   # A single lead entering Adam's ledger — logged at the desk or arriving through a referrer's link, tagged to whoever sent it.
        └── Marketing                                          # Adam's lead-gen tools: his public sign-up funnel, VSL, and the assets that recruit new referrers to drive leads for him.
            └── Landing / New Referral Sign-Up Page (VSL)      # Public page where creators/side-hustlers watch the pitch and join. Email capture feeds Adam's CRM; the contact becomes Adam's.
                └── New Sign Up (John Doe)                     # A referrer joining under Adam. On sign-up the system auto-provisions their portal, link, QR, and welcome/nurture emails.
                    └── Public Portal (John Doe)               # John's referrer view: his earnings, the people he referred, his link and QR. He operates it but owns none of the contacts.
    └── Sales Agent Portal (Demo Agent)                        # A second agent on the same rooftop. Runs an identical system with their own separate book; can't see Adam's contacts, only their own.
        └── Profile                                            # The demo agent's account details, payout settings, and branding — independent from Adam's, scoped to their own portal and funnel.
        └── Ledger                                             # The demo agent's own book. Contacts they own, referral statuses, and payout totals — invisible to other agents, visible only to Adam as admin.
            └── New Referral                                   # A single lead entering the demo agent's ledger, owned by that agent and rolled up to Adam's rooftop admin view.
        └── Marketing                                          # The demo agent's lead-gen tools: their own sign-up funnel, VSL, and referrer-recruiting assets, separate from Adam's.
            └── Landing / New Referral Sign-Up Page (VSL)      # The demo agent's public sign-up page. Email capture feeds this agent's book — those contacts belong to the demo agent, not Adam.
                └── New Sign Up (Jane Doe)                     # A referrer joining under the demo agent. Same auto-provisioning: portal, link, QR, and nurture emails spun up on sign-up.
                    └── Public Portal (Jane Doe)               # Jane's referrer view under the demo agent: her earnings, her referred leads, her link and QR. Operates it, owns nothing.