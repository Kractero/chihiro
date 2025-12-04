<script lang="ts">
  import { parseXML } from '$lib/parser'
  import type { TradesData } from '$lib/types'

  let nation = $state('')
  let showResults = $state(false)
  let tradesData: TradesData | null = $state(null)
  let nationData: { name: string; flag: string } | null = $state(null)
  let loading = $state(false)

  const rarityMap = {
    c: { name: 'common', color: '#c9c9c9' },
    u: { name: 'uncommon', color: '#60d774' },
    r: { name: 'rare', color: '#5ab2de' },
    ur: { name: 'ultra-rare', color: '#d171e3' },
    e: { name: 'epic', color: '#d59b62' },
    l: { name: 'legendary', color: '#e4c21b' },
  }
  const seasonMap = {
    1: { name: 'Season 1', color: '#ffdfdf' },
    2: { name: 'Season 2', color: '#dff0ff' },
    3: { name: 'Season 3', color: '#fff1c5' },
    4: { name: 'Season 4', color: '#cfffd7' },
  }

  async function onClick() {
    if (!nation) return

    showResults = true
    loading = true

    try {
      const res = await fetch(`/api/maki?nation=${nation}`)
      const resData = await res.json()

      const tes = await parseXML(`https://www.nationstates.net/cgi-bin/api.cgi?nation=${nation}&q=name+flag`, nation)
      tradesData = resData
      if (tes) {
        nationData = {
          name: tes.NATION.NAME,
          flag: tes.NATION.FLAG,
        }
      }
    } catch (err) {
      console.error('Error fetching trades:', err)
    } finally {
      loading = false
    }
  }
</script>

<div class="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center">
  <div class="relative">
    <p>I am {showResults}</p>
    {#if !showResults}
      <div id="input" class="relative border border-white/10 rounded-xl p-8 space-y-5">
        <div class="space-y-5">
          <div>
            <label class="block text-white/60 text-sm font-semibold mb-2" for="nation">Nation Name</label>
            <input
              type="text"
              placeholder="Nation name"
              class="w-full border border-white/10 rounded-xl p-4 text-white/80 placeholder-white/30"
              id="nation"
              name="nation"
              bind:value={nation}
            />
          </div>
          <button
            onclick={onClick}
            disabled={!nation}
            class="w-full border border-white/10 rounded-xl p-3 text-white/80 disabled:text-white/30 font-bold enabled:hover:scale-[1.02]"
            >Wrapped Me</button
          >
        </div>
      </div>
    {:else}
      <div id="results" class="relative border border-white/10 rounded-xl p-8 space-y-5 w-[400px]">
        <h2 class="text-white text-lg font-bold mb-4">
          {#if loading}
            <div class="h-6 w-48 bg-white/20 rounded animate-pulse"></div>
          {:else if nationData}
            {nationData.name}'s 2025
          {/if}
        </h2>

        <div class="w-full h-48 bg-white/10 rounded-xl flex items-center justify-center mb-4">
          {#if loading}
            <div class="animate-pulse w-full h-full bg-white/20"></div>
          {:else if nationData}
            <img src={nationData.flag} alt="{nationData.name} flag" class="h-full w-full object-cover rounded-xl" />
          {/if}
        </div>

        <div class="space-y-4">
          {#if loading}
            <div class="bg-white/5 p-4 rounded-xl">
              <h3 class="text-white font-semibold mb-2">You started off the year with...</h3>
              <div class="space-y-2">
                <div class="h-4 bg-white/20 rounded w-3/4 animate-pulse"></div>
                <div class="h-4 bg-white/20 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>

            <div class="bg-white/5 p-4 rounded-xl">
              <h3 class="text-white font-semibold mb-2">Do you remember these big trades?</h3>
              <div class="space-y-2">
                <div class="h-4 bg-white/20 rounded w-3/4 animate-pulse"></div>
                <div class="h-4 bg-white/20 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>

            <div class="bg-white/5 p-4 rounded-xl">
              <h3 class="text-white font-semibold mb-2">You really liked these rarites...</h3>
              <div class="space-y-2">
                <div class="h-4 bg-white/20 rounded w-1/2 animate-pulse"></div>
                <div class="h-4 bg-white/20 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>

            <div class="bg-white/5 p-4 rounded-xl">
              <h3 class="text-white font-semibold mb-2">Trading through the offseasons...</h3>
              <div class="space-y-2">
                <div class="h-4 bg-white/20 rounded w-1/2 animate-pulse"></div>
                <div class="h-4 bg-white/20 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>

            <div class="bg-white/5 p-4 rounded-xl">
              <h3 class="text-white font-semibold mb-2">Your total activity...</h3>
              <div class="space-y-2">
                <div class="h-4 bg-white/20 rounded w-1/4 animate-pulse"></div>
                <div class="h-4 bg-white/20 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          {:else if tradesData && tradesData?.buyTot + tradesData?.sellTot === 0}
            <div class="bg-white/5 p-4 rounded-xl text-white/80 text-sm text-center">
              You made no trades this year :(
            </div>
          {:else if tradesData}
            <div class="bg-white/5 p-4 rounded-xl">
              <h3 class="text-white font-semibold mb-2">You started off the year with...</h3>
              <div class="space-y-2">
                <div class="text-white/80 text-sm">
                  {#if tradesData.earliestBuy?.card_id}
                    A <span class="text-[#aadb1e]">purchase</span> of
                    <a
                      target="_blank"
                      class="text-[#c5b4e3] hover:underline"
                      href={`https://www.nationstates.net/page=deck/card=${tradesData.earliestBuy.card_id}/season=${tradesData.earliestBuy.season}`}
                    >
                      S{tradesData.earliestBuy.season}
                      {tradesData.earliestBuy.card_name}
                    </a>
                    from
                    <a href={`https://www.nationstates.net/nation=${tradesData.earliestBuy.seller}`}>
                      {tradesData.earliestBuy.seller}
                    </a>
                    for {tradesData.earliestBuy.price} bank on
                    <span>{new Date(tradesData.earliestBuy.timestamp * 1000).toLocaleDateString()}</span>!
                  {:else}
                    You bought no cards this year!
                  {/if}
                </div>
                <div class="text-white/80 text-sm">
                  {#if tradesData.earliestSell?.card_id}
                    A <span class="text-[#2ad2c9]">sale</span> of
                    <a
                      target="_blank"
                      class="text-[#c5b4e3] hover:underline"
                      href={`https://www.nationstates.net/page=deck/card=${tradesData.earliestSell.card_id}/season=${tradesData.earliestSell.season}`}
                    >
                      S{tradesData.earliestSell.season}
                      {tradesData.earliestSell.card_name}
                    </a>
                    to
                    <a href={`https://www.nationstates.net/nation=${tradesData.earliestSell.buyer}`}>
                      {tradesData.earliestSell.buyer}
                    </a>
                    for {tradesData.earliestSell.price} bank on
                    <span>{new Date(tradesData.earliestSell.timestamp * 1000).toLocaleDateString()}</span>!
                  {:else}
                    You sold no cards this year!
                  {/if}
                </div>
              </div>
            </div>

            <div class="bg-white/5 p-4 rounded-xl">
              <h3 class="text-white font-semibold mb-2">Do you remember these big trades?</h3>
              <div class="space-y-2">
                <div class="text-white/80 text-sm">
                  {#if tradesData.mostExpensiveBuy?.card_id}
                    A <span class="text-[#aadb1e]">purchase</span> of
                    <a
                      target="_blank"
                      class="text-[#c5b4e3] hover:underline"
                      href={`https://www.nationstates.net/page=deck/card=${tradesData.mostExpensiveBuy.card_id}/season=${tradesData.mostExpensiveBuy.season}`}
                    >
                      S{tradesData.mostExpensiveBuy.season}
                      {tradesData.mostExpensiveBuy.card_name}
                    </a>
                    from
                    <a
                      target="_blank"
                      href={`https://www.nationstates.net/nation=${tradesData.mostExpensiveBuy.seller}`}
                    >
                      {tradesData.mostExpensiveBuy.seller}
                    </a>
                    for {tradesData.mostExpensiveBuy.price} bank on
                    <span>{new Date(tradesData.mostExpensiveBuy.timestamp * 1000).toLocaleDateString()}</span>!
                  {:else}
                    You bought no cards this year!
                  {/if}
                </div>

                <div class="text-white/80 text-sm">
                  {#if tradesData.mostExpensiveSale?.card_id}
                    A <span class="text-[#2ad2c9]">sale</span> of
                    <a
                      target="_blank"
                      class="text-[#c5b4e3] hover:underline"
                      href={`https://www.nationstates.net/page=deck/card=${tradesData.mostExpensiveSale.card_id}/season=${tradesData.mostExpensiveSale.season}`}
                    >
                      S{tradesData.mostExpensiveSale.season}
                      {tradesData.mostExpensiveSale.card_name}
                    </a>
                    to
                    <a
                      target="_blank"
                      href={`https://www.nationstates.net/nation=${tradesData.mostExpensiveSale.buyer}`}
                    >
                      {tradesData.mostExpensiveSale.buyer}
                    </a>
                    for {tradesData.mostExpensiveSale.price} bank on
                    <span>{new Date(tradesData.mostExpensiveSale.timestamp * 1000).toLocaleDateString()}</span>!
                  {:else}
                    You sold no cards this year!
                  {/if}
                </div>
              </div>
            </div>

            <div class="bg-white/5 p-4 rounded-xl">
              <h3 class="text-white font-semibold mb-2">You really liked these rarities...</h3>
              <div class="space-y-2">
                <p class="text-white/80 text-sm">
                  {#if tradesData.mostTradedCategory.count > 0}
                    You bought {tradesData.mostTradedCategory.count}
                    <span style="color: {rarityMap[tradesData.mostTradedCategory.rarity].color}; font-weight: bold">
                      {rarityMap[tradesData.mostTradedCategory.rarity].name}
                    </span> cards!
                  {:else}
                    You bought no cards this year!
                  {/if}
                </p>
                <p class="text-white/80 text-sm">
                  {#if tradesData.mostTradedCategorySold.count > 0}
                    You sold {tradesData.mostTradedCategorySold.count}
                    <span style="color: {rarityMap[tradesData.mostTradedCategorySold.rarity].color}; font-weight: bold">
                      {rarityMap[tradesData.mostTradedCategorySold.rarity].name}
                    </span> cards!
                  {:else}
                    You sold no cards this year!
                  {/if}
                </p>
              </div>
            </div>

            <div class="bg-white/5 p-4 rounded-xl">
              <h3 class="text-white font-semibold mb-2">Trading through the seasons...</h3>
              <div class="space-y-2">
                <p class="text-white/80 text-sm">
                  {#if tradesData.mostTradedSeason.count > 0}
                    {#if tradesData.mostTradedSeason.season === 4}
                      Not a fan of the old stuff huh? You bought cards from
                      <span style="color: {seasonMap[4].color}; font-weight: bold">{seasonMap[4].name}</span>
                      {tradesData.mostTradedSeason.count} times!
                    {:else}
                      You bought cards from
                      <span style="color: {seasonMap[tradesData.mostTradedSeason.season].color}; font-weight: bold">
                        {seasonMap[tradesData.mostTradedSeason.season].name}
                      </span>
                      {tradesData.mostTradedSeason.count} times!
                    {/if}
                  {:else}
                    You bought no cards this year!
                  {/if}
                </p>

                <p class="text-white/80 text-sm">
                  {#if tradesData.mostTradedSeasonSold.count > 0}
                    {#if tradesData.mostTradedSeasonSold.season === 4}
                      Not a fan of the old stuff huh? You sold cards from
                      <span style="color: {seasonMap[4].color}; font-weight: bold">{seasonMap[4].name}</span>
                      {tradesData.mostTradedSeasonSold.count} times!
                    {:else}
                      You sold cards from
                      <span style="color: {seasonMap[tradesData.mostTradedSeasonSold.season].color}; font-weight: bold">
                        {seasonMap[tradesData.mostTradedSeasonSold.season].name}
                      </span>
                      {tradesData.mostTradedSeasonSold.count} times!
                    {/if}
                  {:else}
                    You sold no cards this year!
                  {/if}
                </p>
              </div>
            </div>

            <div class="bg-white/5 p-4 rounded-xl">
              <h3 class="text-white font-semibold mb-2">Your total activity...</h3>
              <div class="space-y-2">
                <p class="text-white/80 text-sm">
                  You bought {tradesData.buyTot > 0 ? tradesData.buyTot : 'no'} cards this year!
                </p>
                <p class="text-white/80 text-sm">
                  You sold {tradesData.sellTot > 0 ? tradesData.sellTot : 'no'} cards this year!
                </p>
              </div>
            </div>
          {/if}
          <button
            onclick={() => (showResults = false)}
            class="w-full border border-white/10 rounded-xl p-3 text-white/80 font-bold enabled:hover:scale-[1.02]"
          >
            New Wrapped
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
