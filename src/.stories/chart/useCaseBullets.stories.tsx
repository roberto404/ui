import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartCard from "../../chart/card/card";
import NumberedTitle from "../../chart/card/parts/numberedTitle";
import Bullet from "../../chart/bullet";

/* !- Helpers */

const Wrapper = ({ children }: any) => (
  <div
    style={{
      width: 460,
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
  title: "Chart/Card/Usecase-Bullets",
  component: ChartCard,
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Viszonyítás: ChartCard + responsive Bullet (svg, a kártya szélességére skálázódik),
 * cél-vonallal
 */
export const Comparison: Story = {
  render: () => (
    <Wrapper>
      <ChartCard
        id="UsecaseBullets/comparison"
        title={<NumberedTitle index={4} title="Viszonyítás" />}
        ratio="auto"
        chart={() => (
          <Bullet
            rows={[
              { label: "Ez a kampány", value: 20, active: true },
              { label: "Előző kampány", value: 14 },
              { label: "12 havi átlag", value: 15 },
            ]}
            target={{ value: 25 }}
            max={30}
            activeColor="#186eff"
            targetColor="#ffab2b"
            valueFormat={(value) => `${value} %`}
            responsive
          />
        )}
      />
    </Wrapper>
  ),
};

Comparison.storyName = "Viszonyítás";
