import React from "react";
import { Meta, StoryObj } from "@storybook/react";

require("../../../assets/style/index.scss");

/* !- Components */

import ChartCard from "../../chart/card/card";
import NumberedTitle from "../../chart/card/parts/numberedTitle";
import Funnel, { IFunnelStep } from "../../chart/funnel";

/* !- Helpers */

const numberFormat = new Intl.NumberFormat("hu-HU");

const Wrapper = ({ children }: any) => (
  <div
    style={{
      width: 400,
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
  title: "Chart/Card/Usecase-Funnels",
  component: ChartCard,
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Konverzió: ChartCard + responsive Funnel (a képarányt a Funnel tartja, `ratio="auto"`),
 * a lemorzsolódás a connectoron, a következtetés a footerben
 */
export const Conversion: Story = {
  render: () => (
    <Wrapper>
      <ChartCard
        id="UsecaseFunnels/conversion"
        title={<NumberedTitle index={2} title="Konverzió" />}
        ratio="auto"
        chart={() => (
          <Funnel
            data={[
              { label: "Regisztrált", value: 100, color: "#186eff" },
              { label: "beváltott", value: 20, color: "#e08543" },
            ]}
            valueFormat={(value) => numberFormat.format(value)}
            dropFormat={(prev: IFunnelStep, next: IFunnelStep) =>
              `−${numberFormat.format(prev.value - next.value)} fő lemorzsolódás`
            }
            height={300}
            responsive
          />
        )}
        footer={
          <div className="text-s text-line-m mt-1">
            <span className="bold">80 fő</span> regisztrált, de nem vásárolt —
            azonnal elérhető remarketing-célcsoport.
          </div>
        }
      />
    </Wrapper>
  ),
};

Conversion.storyName = "Konverzió";

/**
 * Üres állapot: a ChartCard `empty` szövege a chart helyén, a footer rejtve
 */
export const Empty: Story = {
  render: () => (
    <Wrapper>
      <ChartCard
        id="UsecaseFunnels/empty"
        title={<NumberedTitle index={2} title="Konverzió" />}
        ratio="auto"
        chart={() => null}
        empty="Regisztráció nélküli kupon"
      />
    </Wrapper>
  ),
};
