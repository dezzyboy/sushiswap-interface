import { ChevronLeftIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { PoolType } from '@sushiswap/tines'
import Button from 'app/components/Button'
import Divider from 'app/components/Divider'
import ListPanel from 'app/components/ListPanel'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import React, { FC } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

// @ts-ignore
import { useIndependentAssetInputs } from '../../context/hooks/useIndependentAssetInputs'
import { showReviewAtom } from '../context/atoms'
import { useClassicPoolCreateExecute } from '../context/hooks/useClassicPoolCreateExecute'
import { usePoolDetailsMint } from '../context/hooks/usePoolDetails'
import { selectedPoolTypeAtom } from './context/atoms'

// TODO: NEXT PR TO ADJUST TO NEW STORES

const AddTransactionReviewModal: FC = () => {
  const { i18n } = useLingui()
  const [showReview, setShowReview] = useRecoilState(showReviewAtom)
  const {
    parsedAmounts,
    currencies: [selectedPoolCurrencies],
  } = useIndependentAssetInputs()
  const selectedPoolType = useRecoilValue(selectedPoolTypeAtom)
  const { execute } = useClassicPoolCreateExecute()
  const { price } = usePoolDetailsMint(parsedAmounts)

  // Need to use controlled modal here as open variable comes from the liquidityPageState.
  // In other words, this modal needs to be able to get spawned from anywhere within this context
  return (
    <HeadlessUIModal.Controlled isOpen={showReview} onDismiss={() => setShowReview(false)}>
      <div className="flex flex-col h-full gap-8 pb-4 lg:max-w-lg">
        <div className="relative">
          <div className="absolute w-full h-full pointer-events-none bg-gradient-to-r from-opaque-blue to-opaque-pink opacity-20" />
          <div className="flex flex-col gap-4 px-5 pt-5 pb-8">
            <div className="flex flex-row justify-between">
              <Button
                color="blue"
                variant="outlined"
                size="sm"
                className="py-1 pl-2 rounded-full cursor-pointer"
                startIcon={<ChevronLeftIcon width={24} height={24} />}
                onClick={() => setShowReview(false)}
              >
                {i18n._(t`Back`)}
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="h2" weight={700} className="text-high-emphesis">
                {i18n._(t`Confirm Pool Creation`)}
              </Typography>
              <Typography variant="sm">
                {i18n._(
                  t`When creating a pool you are the first liquidity provider. The ratio of tokens you add will set the price of this pool.`
                )}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 px-5">
            <Typography weight={700} variant="lg">
              {selectedPoolType === PoolType.ConstantProduct && i18n._(t`You are creating a classic pool with:`)}
              {selectedPoolType === PoolType.Weighted && i18n._(t`You are creating a index pool with:`)}
              {selectedPoolType === PoolType.Hybrid && i18n._(t`You are creating a multi-asset pool with:`)}
              {selectedPoolType === PoolType.ConcentratedLiquidity &&
                i18n._(t`You are creating a concentrated liquidity pool with:`)}
            </Typography>
            <ListPanel
              items={parsedAmounts.map((amount, index) => (
                <ListPanel.CurrencyAmountItem amount={amount} key={index} />
              ))}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 px-5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <Typography variant="sm">{i18n._(t`Rates:`)}</Typography>
              <Typography variant="sm" className="text-right">
                1 {selectedPoolCurrencies[0]?.symbol} = {price?.toSignificant(6)} {selectedPoolCurrencies[1]?.symbol}
              </Typography>
            </div>
            <div className="flex justify-end">
              <Typography variant="sm" className="text-right">
                1 {selectedPoolCurrencies[1]?.symbol} = {price?.invert().toSignificant(6)}{' '}
                {selectedPoolCurrencies[0]?.symbol}
              </Typography>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`${selectedPoolCurrencies[0]?.symbol} Deposited:`)}
              </Typography>
              <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
                0.00 → {parsedAmounts[0]?.toSignificant(6)} {parsedAmounts[0]?.currency.symbol}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`${selectedPoolCurrencies[1]?.symbol} Deposited:`)}
              </Typography>
              <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
                0.00 → {parsedAmounts[1]?.toSignificant(6)} {parsedAmounts[1]?.currency.symbol}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="sm" className="text-secondary">
                {i18n._(t`Share of Pool`)}
              </Typography>
              <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
                0.00% → <span className="text-green">100%</span>
              </Typography>
            </div>
          </div>
          <Button color="gradient" size="lg" onClick={execute}>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {i18n._(t`Confirm Pool Creation`)}
            </Typography>
          </Button>
        </div>
      </div>
    </HeadlessUIModal.Controlled>
  )
}

export default AddTransactionReviewModal
