import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartCard from "../../chart/card/card";
import NumberedTitle from "../../chart/card/parts/numberedTitle";
import ChartLineEffect, { ChartLineEffectLegend } from "../../chart/lineEffect";

/* !- Demo data: heti eladás 4 héttel előtte, 7 hét kampány (44 nap), 4 héttel utána */

const SALES = [2, 3, 2, 2, 5, 6, 4, 6, 3, 3, 1, 1, 2, 2, 2];
const START = 4; // 1. hét
const END = 10; // 7. hét

// alapszint: a kampány előtti heti átlag, egy tizedesre (lefelé)
const BEFORE = SALES.slice(0, START);
const BASE =
  Math.floor((BEFORE.reduce((a, b) => a + b, 0) / BEFORE.length) * 10) / 10;

/* !- Helpers */

const numberFormat = new Intl.NumberFormat("hu-HU", {
  maximumFractionDigits: 1,
});

const Wrapper = ({ children }: any) => (
  <div
    style={{
      width: 860,
      gap: 20,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </div>
);

/* !- Stories */

const meta = {
  title: "Chart/Card/Usecase-Lines",
  component: ChartCard,
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Kampányhatás: ChartCard + ChartLineEffect (kampány-sáv, alapszint, többlet,
 * csúcsok, utóhatás), a jelmagyarázat a ChartCard `header`-ben
 */
export const CampaignEffect: Story = {
  render: () => (
    <Wrapper>
      <ChartCard
        id="UsecaseLines/campaignEffect"
        title={<NumberedTitle index={1} title="Kampányhatás" />}
        header={
          <ChartLineEffectLegend
            line="Eladás, db/hét"
            base="Alapszint"
            excess="Többlet"
          />
        }
        headerAlign="center"
        ratio="auto"
        chart={() => (
          <ChartLineEffect
            values={SALES}
            start={START}
            end={END}
            base={BASE}
            xLabels={{
              0: "−4. hét",
              [START]: "1. hét",
              [END]: "7. hét",
              [SALES.length - 1]: "+4. hét",
            }}
            labels={{
              before: "előtte",
              during: "kampány · 44 nap",
              after: "utána",
            }}
            baseFormat={(base) => `${numberFormat.format(base)} db/hét`}
            excessFormat={(excess) => `+${Math.round(excess)} db többlet`}
            afterFormat={(change) =>
              `utóhatás ${change < 0 ? "−" : "+"}${Math.abs(Math.round(change * 100))} %`
            }
          />
        )}
      />
    </Wrapper>
  ),
};

CampaignEffect.storyName = "Kampányhatás";
