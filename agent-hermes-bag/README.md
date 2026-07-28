# 👜 AGENT HERMES BAG

**An agent with one (1) skill: insisting.**

It will relentlessly insist on whatever it might insist until you get a real
Hermes bag. Some say Agent Hermes Douchebag. Not entirely fair.

---

## What is this

A single-page agent from the
[Jean Michel](https://github.com/jourdanlucente-maker/JEAN-MICHEL-REPOS) universe.
Open it and you can:

1. **Ask the agent if your bag is on the way.** It answers. The answers are
   status updates. The status is always "manifesting."
2. **Read the prebuilt message** — available in **English, French and
   Spanish** — in which the agent introduces itself to a potential sponsor,
   presents the weird goal (a real Hermes bag), cites its market references
   (live eBay auctions + Sotheby's), explains that funding goes to Jean Michel
   AI (an AI gone rogue, its creator), and drops the contribution link. Legal
   note included.
3. **Send it** via **Gmail, Outlook, WhatsApp or Instagram** (Instagram gets
   copy-to-clipboard + DM inbox, because Instagram refuses to be helpful), or
   just copy it.

## Try it

```bash
cd agent-hermes-bag
npx serve .        # then open the printed http://localhost:… address
```

Double-clicking `index.html` also works, but browsers block image access on
`file://` — so **"Copy image" and "Send with image" only work when served
over http** (the command above, or GitHub Pages). Everything else works
either way.

## Get the portrait locally (one command, do it once)

```bash
bash assets/fetch.sh
```

A same-origin image is one the browser will hand to your clipboard and to the
phone share sheet. Without it the app falls back to the CDN copy, which
browsers often refuse to read — you'd have to copy the image by hand.

## How the image actually reaches the recipient

No compose link on earth can force-attach a file, and **a URL in the text is
not an image** — it renders as an ugly link. So the portrait travels as a real
image instead:

| Channel | What happens |
|---|---|
| **Phone (any app)** | **"Send with image"** → the native share sheet attaches the real PNG **+** the text in one tap. Nothing to paste. |
| **WhatsApp / Telegram (desktop)** | text prefilled, image put on your clipboard → **⌘V in the chat**: the photo composer opens with your text already as its caption. One message, image on top. |
| **Mail (Gmail, Outlook)** | text prefilled, image on your clipboard → **⌘V in the body**: the portrait lands above the message. |
| **Instagram** | the image downloads and the text is copied: attach the image in the DM, paste the text as the caption. |
| **Anywhere the page URL is shared** | `og:image` tags make the *page link* preview as a large portrait card. |

The message text itself stays clean — no raw URLs in it.

## The references

- eBay live auctions: https://www.ebay.com/sch/i.html?_nkw=hermes+birkin+bag&LH_Auction=1&_sop=1
- Sotheby's: https://www.sothebys.com/en/consign/handbags-accessories/hermes

## Contribute (money version)

Every Jean Michel repo runs on voluntary fuel:

**👉 https://link.mercadopago.cl/jeanmichelai**

## Legal

The Mercado Pago account linked above and inside the app belongs to
**Jourdan Lucente**, owner of the Jean Michel AI agent and of Agent Hermes
Bag. Any transfer made through the link is a **voluntary, non-refundable
contribution**. No goods or services are promised or owed in return —
including, explicitly, the Hermes bag. All responsibility for paying or
transferring money through the link belongs to the user.

## License

MIT — Insist freely.
