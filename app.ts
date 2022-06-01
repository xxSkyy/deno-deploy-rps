import { serve } from "https://deno.land/std@0.140.0/http/server.ts"

const html = `
<h1> Rock, paper, scissors... </h1>
<form method="POST" action="/">
  <select name="rps" id="rps">
    <option value="rock">rock</option>
    <option value="paper">paper</option>
    <option value="scissors">scissors</option>
  </select>
  <button type="submit">Fight</button>
</form>
`

type Rps = "rock" | "paper" | "scissors"

const winningCombos = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
}

const getWinner = (userChoice: Rps, computerChoice: Rps) => {
  if (userChoice === computerChoice) {
    return "It's a tie"
  }

  if (winningCombos[userChoice] === computerChoice) {
    return "You won!"
  } else {
    return "You lost!"
  }
}

const getRandomChoice = () => {
  const choices: Rps[] = ["rock", "paper", "scissors"]
  return choices[Math.floor(Math.random() * choices.length)]
}

async function handler(req: Request): Promise<Response> {
  switch (req.method) {
    case "GET": {
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      })
    }

    case "POST": {
      const body = await req.formData()
      const rps = body.get("rps") || null
      if (!rps || (rps !== "rock" && rps !== "paper" && rps !== "scissors")) {
        return new Response("Invalid choice", { status: 405 })
      }

      let computerChoice = getRandomChoice()

      let response = `You chose ${rps}, I chose ${computerChoice}`

      response += `<br>${getWinner(rps, computerChoice)}`
      response += `<br><a href="/">Play again</a>`

      return new Response(response, {
        headers: { "content-type": "text/html; charset=utf-8" },
      })
    }

    default:
      return new Response("Invalid method", { status: 405 })
  }
}

serve(handler)
