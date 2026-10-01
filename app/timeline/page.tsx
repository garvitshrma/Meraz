import type { Metadata } from "next";
import SplitFlapBoard from "@/components/SplitFlapBoard";
import PrintButton from "@/components/PrintButton";
import { Container, PageHeader } from "@/components/ui";
import { timeline } from "@/data/content";

export const metadata: Metadata = { title: "Event Timeline", description: "Three days of non-stop excitement at Meraz 7.0." };

// Route exists on the reference site (not linked from its menu). Same data and "Download Full Schedule" button.
export default function TimelinePage() {
  return (
    <>
      <PageHeader hindi="समय-सारणी" title="Event Timeline" tone="teal">
        Three days of non-stop excitement.
      </PageHeader>
      <Container className="py-16 print:hidden">
        <SplitFlapBoard days={timeline} />
        <div className="mt-10 text-center">
          <PrintButton />
        </div>
      </Container>

      {/* full schedule, only when printing / saving as PDF */}
      <div className="hidden p-8 text-ink print:block">
        <h2 className="text-2xl font-bold">Meraz 7.0 schedule</h2>
        {timeline.map((d) => (
          <section key={d.date} className="mt-6">
            <h3 className="text-lg font-bold">
              {d.date} ({d.time})
            </h3>
            <table className="mt-2 w-full text-left">
              <tbody>
                {d.events.map((e) => (
                  <tr key={e.title}>
                    <td className="w-28 py-1">{e.time}</td>
                    <td className="py-1">{e.title}</td>
                    <td className="py-1">{e.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </>
  );
}
