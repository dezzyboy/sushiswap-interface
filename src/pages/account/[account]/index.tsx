import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  LegacyLiquidityPositionsBalances,
  TridentLiquidityPositionsBalances,
} from 'app/features/account/AssetBalances/liquidityPositions'
import ActionsModal from 'app/features/portfolio/ActionsModal'
import { BentoBalances, WalletBalances } from 'app/features/portfolio/AssetBalances/bentoAndWallet'
import HeaderDropdown from 'app/features/portfolio/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React from 'react'

const Portfolio = () => {
  const { i18n } = useLingui()

  const router = useRouter()

  const account = router.query.account as string

  // const account = useAccountInUrl('/')

  // if (!account) return

  return (
    <>
      <NextSeo title={`${i18n._(t`Account`)} ${account}`} />
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} />
      </TridentHeader>
      <TridentBody className="flex flex-col grid-cols-2 gap-10 lg:grid lg:gap-4">
        <WalletBalances account={account} />
        <BentoBalances account={account} />
        <div className="flex flex-col col-span-2 gap-10 lg:gap-4">
          <TridentLiquidityPositionsBalances />
          <LegacyLiquidityPositionsBalances />
        </div>
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio
