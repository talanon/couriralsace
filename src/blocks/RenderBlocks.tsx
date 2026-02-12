import React, { Fragment } from 'react'

import type { Event, Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { EventGridBlock } from '@/blocks/EventGrid/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HomeHeroBlock } from '@/blocks/HomeHero/Component'
import { ImageTextBlock } from '@/blocks/ImageText/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { AlsaceEventsMapBlock } from '@/blocks/AlsaceEventsMap/Component'
import { SectionEnteteBlock } from '@/blocks/SectionEntete/Component'
import { TimelineBlock } from '@/blocks/Timeline/Component'
import { BlockScrollReveal } from '@/components/ScrollReveal/BlockScrollReveal.client'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  homeHero: HomeHeroBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  alsaceEventsMap: AlsaceEventsMapBlock,
  sectionEntete: SectionEnteteBlock,
  eventGrid: EventGridBlock,
  imageText: ImageTextBlock,
  timeline: TimelineBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  currentEvent?: Event | null
}> = (props) => {
  const { blocks, currentEvent } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && Object.hasOwn(blockComponents, blockType)) {
            const Block = blockComponents[blockType as keyof typeof blockComponents] as React.ComponentType<any>

            if (Block) {
              return (
                <BlockScrollReveal key={index}>
                  <div className="">
                    <Block {...block} currentEvent={currentEvent} disableInnerContainer />
                  </div>
                </BlockScrollReveal>
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
