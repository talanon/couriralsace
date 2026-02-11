import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { EventGridBlock } from '@/blocks/EventGrid/Component'
import { FeatureSectionBlock } from '@/blocks/FeatureSection/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HomeHeroBlock } from '@/blocks/HomeHero/Component'
import { ImageTextBlock } from '@/blocks/ImageText/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { AlsaceEventsMapBlock } from '@/blocks/AlsaceEventsMap/Component'
import { SectionEnteteBlock } from '@/blocks/SectionEntete/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { TimelineBlock } from '@/blocks/Timeline/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  homeHero: HomeHeroBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  alsaceEventsMap: AlsaceEventsMapBlock,
  sectionEntete: SectionEnteteBlock,
  stats: StatsBlock,
  featureSection: FeatureSectionBlock,
  eventGrid: EventGridBlock,
  imageText: ImageTextBlock,
  timeline: TimelineBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
