import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

export default function Home() {
  return (
    <Layout
      title="Physical AI & Humanoid Robotics Textbook"
      description="Complete AI-Native textbook for mastering robotics, humanoids, ROS2, VLA systems, and digital twins."
    >
      {/* HERO SECTION */}
      <header
        style={{
          padding: "80px 20px",
          textAlign: "center",
          background: "linear-gradient(135deg, #0b0f19, #1f2a44)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "54px", fontWeight: "bold", marginBottom: "20px" }}>
          Physical AI & Humanoid Robotics Textbook
        </h1>
        <p style={{ fontSize: "22px", maxWidth: "850px", margin: "0 auto", lineHeight: "1.6" }}>
          A complete and practical learning system where you master the future:
          humanoid robotics, ROS 2, large action models, simulation, VLA systems, hardware,
          and advanced AI for next-generation intelligent machines.
        </p>

        <div style={{ marginTop: "40px" }}>
          <Link
            className="button button--primary button--lg"
            to="/docs/introduction/intro"
          >
            Start Reading →
          </Link>
        </div>
      </header>

      {/* ABOUT SECTION */}
      <section style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "36px", marginBottom: "20px", textAlign: "center" }}>
          What This Textbook Covers
        </h2>
        <p style={{ fontSize: "20px", lineHeight: "1.7", color: "#444", textAlign: "center" }}>
          This is a complete AI-native engineering curriculum designed for physical AI, humanoid robots,
          embodied intelligence, ROS 2 programming, digital twin simulations, and Vision-Language-Action
          (VLA) systems. Each module builds your robotics superpowers step by step.
        </p>
      </section>

      {/* MODULE CARDS */}
      <section style={{ padding: "60px 20px", background: "#f9fafc" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "40px", textAlign: "center" }}>
          Explore All Modules
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* MODULE 1 */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Module 1: ROS 2 Foundations</h3>
            <p style={cardText}>
              Learn ROS 2 — the nervous system of modern robots. Build nodes, topics,
              services, actions, publishers, subscribers, QoS, and real robot workflows.
            </p>
            <Link style={cardBtn} to="/ros2-foundations/module-1-ros2">
              Open Module →
            </Link>
          </div>

          {/* MODULE 2 */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Module 2: Simulation & Digital Twins</h3>
            <p style={cardText}>
              Master simulation systems: Gazebo, Unity Robotics, Isaac Sim, and digital
              twin workflows for training and testing robots safely.
            </p>
            <Link style={cardBtn} to="/simulation/module-2-simulation">
              Open Module →
            </Link>
          </div>

          {/* MODULE 3 */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Module 3: Hardware Foundations</h3>
            <p style={cardText}>
              Motors, actuators, torque control, IMUs, sensors, microcontrollers,
              embedded systems — everything real humanoids need.
            </p>
            <Link style={cardBtn} to="/hardware-basics/module-3-hardware">
              Open Module →
            </Link>
          </div>

          {/* MODULE 4 */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Module 4: VLA — Vision, Language, Action</h3>
            <p style={cardText}>
              Learn the most advanced robotics architecture: perception models,
              LLM-driven command systems, action planners, and embodied AI agents.
            </p>
            <Link style={cardBtn} to="/vla-systems/module-4-vla-foundations">
              Open Module →
            </Link>
          </div>

          {/* MODULE 5 */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Module 5: Advanced AI & Motion Control</h3>
            <p style={cardText}>
              Reinforcement learning, motion planning, MPC, trajectory optimization,
              and how robots think and move intelligently.
            </p>
            <Link style={cardBtn} to="/advanced-ai-control/module-5-advanced-ai">
              Open Module →
            </Link>
          </div>

          {/* MODULE 6 */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Module 6: Designing Humanoid Robots</h3>
            <p style={cardText}>
              Learn end-to-end humanoid creation: mechanical design, kinematics, actuators,
              morphologies, energy systems, and AI-driven movement.
            </p>
            <Link style={cardBtn} to="/humanoid-design/module-6-humanoid-design">
              Open Module →
            </Link>
          </div>

          {/* APPENDIX */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Appendix</h3>
            <p style={cardText}>
              Glossary, research papers, references, external resources, and further reading
              for mastering robotics and AI.
            </p>
            <Link style={cardBtn} to="/appendix/glossary">
              Open Appendix →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: "80px 20px", background: "white" }}>
        <h2 style={{ textAlign: "center", fontSize: "34px", marginBottom: "50px" }}>
          Why This Textbook is AI-Native & Future-Focused
        </h2>

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "35px",
          }}
        >
          <div style={featureBox}>
            <h3>AI-Driven Design</h3>
            <p>
              Built fully around modern robotics workflows, from LLM agents to VLA systems
              and intelligent controllers.
            </p>
          </div>

          <div style={featureBox}>
            <h3>Hands-On Learning</h3>
            <p>
              Every module includes practical steps, code examples, simulations, and
              real robot applications.
            </p>
          </div>

          <div style={featureBox}>
            <h3>Industry-Inspired Curriculum</h3>
            <p>
              The content reflects what Tesla Bots, Figure AI, Apptronik, and Sanctuary AI
              use in real humanoid robotics pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        style={{
          padding: "90px 20px",
          background: "#0b0f19",
          color: "white",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "40px", marginBottom: "20px" }}>
          Begin Your Robotics Journey
        </h2>
        <p style={{ fontSize: "20px", marginBottom: "40px", color: "#ccc" }}>
          The future belongs to physical AI, embodied intelligence, and humanoid robotics.
          Start mastering it today.
        </p>

        <Link
          className="button button--primary button--lg"
          to="/introduction/intro"
        >
          Start Reading →
        </Link>
      </section>
    </Layout>
  );
}

/* ======== STYLES ======== */
const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const cardTitle = {
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const cardText = {
  fontSize: "16px",
  color: "#555",
  marginBottom: "20px",
  lineHeight: "1.5",
};

const cardBtn = {
  textDecoration: "none",
  background: "#0057ff",
  padding: "10px 16px",
  color: "white",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "bold",
};

const featureBox = {
  padding: "25px",
  background: "#f5f7fa",
  borderRadius: "10px",
  textAlign: "left",
};
