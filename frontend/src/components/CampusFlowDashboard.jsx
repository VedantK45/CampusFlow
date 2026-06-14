import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";

const digests = {
  today: [
    {
      tag: "academic",
      tagLabel: "Academic",
      subject: "DBMS Assignment #3 – submission reminder",
      from: "prof.sharma@college.edu · 2:15 PM",
      summary:
        "Prof. Sharma reminded students that Assignment #3 on normalization is due tonight at 11:59 PM. Late submissions will incur a 10% penalty per day.",
      body: (
        <>
          <p>
            Prof. Sharma sent a reminder about{" "}
            <strong>DBMS Assignment #3</strong> covering 3NF and BCNF
            normalization. Key points:
          </p>
          <ul>
            <li>Due: Today, 11:59 PM on the student portal</li>
            <li>10% penalty per late day</li>
            <li>Submit as a PDF with your roll number in the filename</li>
            <li>Group submissions are not allowed this time</li>
          </ul>
          <p>
            The professor also mentioned that solutions will be discussed in the
            next class.
          </p>
        </>
      ),
    },
    {
      tag: "placement",
      tagLabel: "Placement",
      subject: "TCS NQT 2025 – registration open for CSE & IT",
      from: "placement@college.edu · 11:30 AM",
      summary:
        "The Placement Cell has opened TCS NQT 2025 registrations for CSE and IT students. Deadline is June 17th. Minimum 7.0 CGPA required.",
      body: (
        <>
          <p>
            The Placement Cell announced that <strong>TCS NQT 2025</strong>{" "}
            registrations are open.
          </p>
          <ul>
            <li>Eligible branches: CSE, IT, ECE (with 7.0+ CGPA)</li>
            <li>Registration deadline: June 17, 6:00 PM</li>
            <li>Drive date: July 5–6, 2025 (online)</li>
            <li>
              Register via the college placement portal using your roll number
            </li>
          </ul>
          <p>
            Students are advised to complete the TCS iON profile beforehand as
            it's required for the application.
          </p>
        </>
      ),
    },
    {
      tag: "hostel",
      tagLabel: "Hostel",
      subject: "Hostel fee payment – last date June 20",
      from: "hostel.warden@college.edu · 9:00 AM",
      summary:
        "The hostel warden has issued a notice that semester hostel fees must be paid by June 20. Students failing to pay will be debarred from the hostel.",
      body: (
        <>
          <p>
            The Hostel Administration issued an important notice regarding{" "}
            <strong>fee payment for Semester 5</strong>.
          </p>
          <ul>
            <li>Last date to pay: June 20, 2025</li>
            <li>Mode: Online via ERP portal (NEFT/UPI accepted)</li>
            <li>Amount: ₹18,500 (mess + accommodation)</li>
            <li>Students with scholarship: submit proof by June 18</li>
          </ul>
          <p>
            Students who fail to pay by the deadline will not be permitted in
            the hostel after June 22.
          </p>
        </>
      ),
    },
  ],
  jun13: [
    {
      tag: "academic",
      tagLabel: "Academic",
      subject: "Mid-semester exam schedule – official notice",
      from: "exam.cell@college.edu · 4:00 PM",
      summary:
        "The Examination Cell released the mid-semester timetable. Exams begin June 23. Hall tickets will be available on the portal from June 18.",
      body: (
        <>
          <p>
            The Examination Cell released the{" "}
            <strong>mid-semester timetable</strong> for all departments.
          </p>
          <ul>
            <li>Exams start: June 23, 2025</li>
            <li>Hall tickets available: June 18 onwards (ERP portal)</li>
            <li>No books or electronic devices allowed in halls</li>
            <li>Report 30 minutes before the scheduled time</li>
          </ul>
        </>
      ),
    },
    {
      tag: "club",
      tagLabel: "Club",
      subject: "Coding Club – Hackathon team formation open",
      from: "codingclub@college.edu · 1:00 PM",
      summary:
        "The Coding Club is forming teams for the upcoming inter-college hackathon on June 28. Teams of 3–4. Register by June 16 via the club portal.",
      body: (
        <>
          <p>
            The Coding Club is organizing team registrations for the{" "}
            <strong>HackIntra 2025 inter-college hackathon</strong>.
          </p>
          <ul>
            <li>Date: June 28–29, 2025 (36 hours)</li>
            <li>Team size: 3–4 members</li>
            <li>Register by: June 16</li>
            <li>Themes: AI/ML, Web3, Social Impact</li>
          </ul>
          <p>
            Cash prizes worth ₹50,000. Cloud credits from AWS and Azure for all
            participants.
          </p>
        </>
      ),
    },
  ],
  jun12: [
    {
      tag: "academic",
      tagLabel: "Academic",
      subject: "OS Lab – viva rescheduled to June 18",
      from: "prof.meena@college.edu · 3:45 PM",
      summary:
        "The OS Lab viva originally scheduled for June 15 has been moved to June 18. Students should prepare chapters 4–7.",
      body: (
        <>
          <p>
            Prof. Meena announced that the <strong>OS Lab viva</strong> has been
            rescheduled.
          </p>
          <ul>
            <li>Original date: June 15</li>
            <li>New date: June 18, 2:00 PM</li>
            <li>Venue: Lab-3, CS block</li>
            <li>Topics: Process scheduling, memory management (Ch. 4–7)</li>
          </ul>
        </>
      ),
    },
  ],
  jun11: [
    {
      tag: "placement",
      tagLabel: "Placement",
      subject: "Infosys InfyTQ certification – deadline extended",
      from: "placement@college.edu · 10:00 AM",
      summary:
        "Infosys has extended the InfyTQ certification deadline to June 25. Students who complete it get preferential treatment in the Infosys campus drive.",
      body: (
        <>
          <p>
            Good news from the Placement Cell —{" "}
            <strong>Infosys has extended the InfyTQ deadline</strong> to June
            25.
          </p>
          <ul>
            <li>Complete the certification at infytq.infosys.com</li>
            <li>Certified students get priority shortlisting</li>
            <li>Drive expected in August 2025</li>
          </ul>
        </>
      ),
    },
  ],
  jun10: [
    {
      tag: "hostel",
      tagLabel: "Hostel",
      subject: "Power shutdown – June 12, 10 AM to 2 PM",
      from: "hostel.warden@college.edu · 5:00 PM",
      summary:
        "The hostel will have a planned power shutdown on June 12 from 10 AM to 2 PM for maintenance. Generators will not be available during this window.",
      body: (
        <>
          <p>
            A <strong>planned power shutdown</strong> is scheduled in the hostel
            premises.
          </p>
          <ul>
            <li>Date: June 12, 10:00 AM – 2:00 PM</li>
            <li>Reason: Annual electrical maintenance</li>
            <li>Generator backup: Not available</li>
            <li>Students advised to charge devices beforehand</li>
          </ul>
        </>
      ),
    },
  ],
  jun9: [
    {
      tag: "academic",
      tagLabel: "Academic",
      subject: "Guest lecture – ML in Industry, June 13",
      from: "dept.cse@college.edu · 2:00 PM",
      summary:
        "A guest lecture on Machine Learning in Industry is scheduled for June 13 at 3 PM. Speaker: Mr. Rajan Nair, Senior Engineer at Google India.",
      body: (
        <>
          <p>
            The CSE Department is hosting a{" "}
            <strong>guest lecture on Machine Learning in Industry</strong>.
          </p>
          <ul>
            <li>Speaker: Mr. Rajan Nair, Senior Engineer, Google India</li>
            <li>Date: June 13, 3:00 PM</li>
            <li>Venue: Seminar Hall, Block A</li>
            <li>Open to all students — attendance optional but encouraged</li>
          </ul>
        </>
      ),
    },
  ],
};

const tagStyles = {
  academic: { background: "rgba(99,102,241,0.12)", color: "#6366F1" },
  placement: { background: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  hostel: { background: "rgba(20,184,166,0.12)", color: "#14B8A6" },
  club: { background: "rgba(244,63,94,0.12)", color: "#F43F5E" },
};

const upcomingEvents = [
  {
    color: "#F59E0B",
    event: "DBMS Assignment #3 due",
    when: "Today, 11:59 PM",
  },
  {
    color: "#6366F1",
    event: "Mid-sem exam timetable released",
    when: "Jun 15, 10:00 AM",
  },
  {
    color: "#14B8A6",
    event: "TCS NQT Registration closes",
    when: "Jun 17, 6:00 PM",
  },
  { color: "#F43F5E", event: "Hostel fee payment deadline", when: "Jun 20" },
];

const pdfReports = [
  {
    name: "Digest – Jun 14, 2025",
    meta: "Generated 8:01 PM · 3 emails",
    file: "digest_jun14.pdf",
  },
  {
    name: "Digest – Jun 13, 2025",
    meta: "Generated 8:00 PM · 5 emails",
    file: "digest_jun13.pdf",
  },
  {
    name: "Digest – Jun 12, 2025",
    meta: "Generated 8:02 PM · 7 emails",
    file: "digest_jun12.pdf",
  },
  {
    name: "Digest – Jun 11, 2025",
    meta: "Generated 8:00 PM · 4 emails",
    file: "digest_jun11.pdf",
  },
];

const dayTabs = [
  { label: "Today", key: "today" },
  { label: "Jun 13", key: "jun13" },
  { label: "Jun 12", key: "jun12" },
  { label: "Jun 11", key: "jun11" },
  { label: "Jun 10", key: "jun10" },
  { label: "Jun 9", key: "jun9" },
];

const navItems = [
  { icon: "📊", label: "Dashboard", active: true },
  { icon: "📧", label: "All Emails" },
  { icon: "📄", label: "PDF Reports" },
];

const campusNavItems = [
  { icon: "🗓️", label: "Schedule" },
  { icon: "🔔", label: "Alerts" },
  { icon: "💼", label: "Placements" },
  { icon: "⚙️", label: "Settings" },
];

function downloadPdf(filename) {
  alert(
    `Downloading ${filename} from S3...\n\nReplace this with:\nfetch('http://localhost:8080/api/reports/download?file=${filename}').then(r => r.json()).then(d => window.open(d.url))`,
  );
}

export default function CampusFlow() {
  const [activeDay, setActiveDay] = useState("today");
  const [modal, setModal] = useState(null); // { entry }
  const stored = JSON.parse(localStorage.getItem("campusflow_user") || "{}");
  const [email, setEmail] = useState(stored.email);
  const [totalEmails, setTotalEmails] = useState(0);
  const [digest, setDigest] = useState([]);

  const entries = digests[activeDay] || [];

  const openModal = (entry) => setModal({ entry });
  const closeModal = () => setModal(null);

  useEffect(() => {
    async function fetchDashboard() {
      const token = localStorage.getItem("campusflow_token");

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // console.log(data);
      // console.log(data.data);
      // console.log(data.data[0]);
      // console.log(data.totalDays);

      setDigest(data.data);
      setTotalEmails(data.totalEmails);
    }

    fetchDashboard();
  }, []);
  console.log(digest);
  console.log(digest[0]);
  // count, day, emails, label

  // Update
  // const updateEmail = (newEmail) => {
  //   localStorage.setItem(
  //     "campusflow_user",
  //     JSON.stringify({ ...stored, email: newEmail }),
  //   );
  // };

  // Send to backend
  // const syncToBackend = async (email) => {
  //   const res = await fetch("http://localhost:8080/api/user/update-email", {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email }),
  //   });
  //   return res.json();
  // };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#0A0E1A",
        color: "#fff",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          minHeight: "100vh",
          background: "#0D1120",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 8px",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #6366F1, #14B8A6)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🎓
          </div>
          <span
            style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.3px" }}
          >
            CampusFlow
          </span>
        </div>

        {/* Overview nav */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            padding: "0 8px",
            marginBottom: 8,
          }}
        >
          Overview
        </div>
        {navItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 10,
              fontSize: 14,
              marginBottom: 2,
              cursor: "pointer",
              background: item.active ? "rgba(99,102,241,0.12)" : "transparent",
              color: item.active ? "#6366F1" : "rgba(255,255,255,0.45)",
              fontWeight: item.active ? 600 : 400,
            }}
          >
            <span style={{ fontSize: 16, width: 18, textAlign: "center" }}>
              {item.icon}
            </span>
            {item.label}
          </div>
        ))}

        {/* Campus nav */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
            padding: "0 8px",
            marginBottom: 8,
            marginTop: 24,
          }}
        >
          Campus
        </div>
        {campusNavItems.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 10,
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              cursor: "pointer",
              marginBottom: 2,
            }}
          >
            <span style={{ fontSize: 16, width: 18, textAlign: "center" }}>
              {item.icon}
            </span>
            {item.label}
          </div>
        ))}

        {/* User footer */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 8px",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366F1, #14B8A6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {email[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  // overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {email}
              </div>
              {/* <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {email}
              </div> */}
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main
        style={{
          marginLeft: 220,
          flex: 1,
          padding: "32px 36px",
          minHeight: "100vh",
        }}
      >
        {/* Topbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.4px" }}
            >
              Welcome, {email} 👋
            </div>
            <div
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.45)",
                marginTop: 2,
              }}
            >
              Here's your campus digest for today
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: "8px 14px",
            }}
          >
            <PulseDot />
            Next digest at <strong style={{ color: "#fff" }}>8:00 PM</strong>
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 28,
          }}
        >
          {[
            {
              label: "Emails processed",
              value: totalEmails,
              color: "#6366F1",
              sub: "This month",
            },
            {
              label: "Digests generated",
              value: 5,
              color: "#14B8A6",
              sub: "Last 30 days",
            },
            {
              label: "Deadlines flagged",
              value: 4,
              color: "#F59E0B",
              sub: "Coming up",
            },
            {
              label: "Reports in S3",
              value: "5",
              color: "#F43F5E",
              sub: "PDF archive",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  lineHeight: 1,
                  marginBottom: 4,
                  color: s.color,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}
        >
          {/* Digest feed */}
          <div>
            <Panel>
              <PanelHeader title="📬 AI Email Digests" action="View all" />
              {/* Day tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  padding: "12px 22px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  overflowX: "auto",
                }}
              >
                {dayTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveDay(tab.key)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontWeight: 500,
                      border: "none",
                      fontFamily: "inherit",
                      background:
                        activeDay === tab.key
                          ? "rgba(99,102,241,0.12)"
                          : "transparent",
                      color:
                        activeDay === tab.key
                          ? "#6366F1"
                          : "rgba(255,255,255,0.45)",
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* Entries */}
              <div>
                {entries.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "rgba(255,255,255,0.25)",
                      fontSize: 14,
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 10 }}>✉️</div>
                    No emails for this day
                  </div>
                ) : (
                  entries.map((entry, i) => (
                    <div
                      key={i}
                      onClick={() => openModal(entry)}
                      style={{
                        padding: "16px 22px",
                        borderBottom:
                          i < entries.length - 1
                            ? "1px solid rgba(255,255,255,0.04)"
                            : "none",
                        cursor: "pointer",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.025)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 5,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            ...tagStyles[entry.tag],
                          }}
                        >
                          {entry.tagLabel}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.25)",
                            marginLeft: "auto",
                          }}
                        >
                          {entry.from.split("·")[1]?.trim()}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {entry.subject}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.45)",
                          lineHeight: 1.55,
                        }}
                      >
                        {entry.summary}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPdf(`${activeDay}_${i}.pdf`);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                          color: "#6366F1",
                          marginTop: 8,
                          background: "rgba(99,102,241,0.12)",
                          padding: "4px 10px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontWeight: 500,
                          border: "none",
                          fontFamily: "inherit",
                        }}
                      >
                        📄 View PDF
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Upcoming */}
            <Panel>
              <PanelHeader title="📅 Coming up" />
              <div>
                {upcomingEvents.map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "13px 20px",
                      borderBottom:
                        i < upcomingEvents.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: ev.color,
                        marginTop: 5,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        {ev.event}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.25)",
                        }}
                      >
                        {ev.when}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* PDF Reports */}
            <Panel>
              <PanelHeader title="📁 PDF Reports" action="View all" />
              <div>
                {pdfReports.map((pdf, i) => (
                  <div
                    key={i}
                    onClick={() => downloadPdf(pdf.file)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 20px",
                      borderBottom:
                        i < pdfReports.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                      cursor: "pointer",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.025)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: "rgba(244,63,94,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      📄
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        {pdf.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.25)",
                        }}
                      >
                        {pdf.meta}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPdf(pdf.file);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.25)",
                        fontSize: 18,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      title="Download"
                    >
                      ⬇
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </main>

      {/* Modal */}
      {modal && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#111827",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 32,
              width: 540,
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "rgba(255,255,255,0.07)",
                border: "none",
                color: "#fff",
                width: 30,
                height: 30,
                borderRadius: "50%",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "inherit",
              }}
            >
              ✕
            </button>
            <div style={{ marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 5,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  ...tagStyles[modal.entry.tag],
                }}
              >
                {modal.entry.tagLabel}
              </span>
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 8,
                letterSpacing: "-0.3px",
              }}
            >
              {modal.entry.subject}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.25)",
                marginBottom: 20,
              }}
            >
              From: {modal.entry.from}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.75,
              }}
            >
              <style>{`
                .modal-body p { margin-bottom: 12px; }
                .modal-body ul { padding-left: 18px; }
                .modal-body li { margin-bottom: 6px; }
              `}</style>
              <div className="modal-body">{modal.entry.body}</div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button
                onClick={() => {
                  downloadPdf("email_digest.pdf");
                  closeModal();
                }}
                style={{
                  padding: "10px 20px",
                  background: "#6366F1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ⬇ Download PDF
              </button>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  color: "rgba(255,255,255,0.45)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PulseDot() {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#14B8A6",
        flexShrink: 0,
        animation: "pulse 2s infinite",
      }}
    >
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }`}</style>
    </div>
  );
}

function Panel({ children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function PanelHeader({ title, action }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 22px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
      {action && (
        <a
          style={{
            fontSize: 13,
            color: "#6366F1",
            cursor: "pointer",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          {action}
        </a>
      )}
    </div>
  );
}
