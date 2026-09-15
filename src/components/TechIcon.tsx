import { FaJava } from "react-icons/fa6";
import {
  SiAndroid,
  SiAnthropic,
  SiBun,
  SiCloudflare,
  SiDocker,
  SiExpress,
  SiFastify,
  SiFirebase,
  SiGithub,
  SiGo,
  SiGraphql,
  SiHono,
  SiJavascript,
  SiMongodb,
  SiMongoose,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiRust,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";
import {
  Code2,
  Database,
  FileText,
  FolderSync,
  ShieldCheck,
  Workflow,
} from "lucide-react";

interface TechIconProps {
  name: string;
  className?: string;
}

export function TechIcon({ name, className = "h-3.5 w-3.5 shrink-0" }: TechIconProps) {
  const norm = name.toLowerCase().trim();

  // Frameworks & Libraries
  if (norm.includes("react")) return <SiReact className={className} aria-hidden="true" />;
  if (norm.includes("next")) return <SiNextdotjs className={className} aria-hidden="true" />;
  if (norm.includes("vite")) return <SiVite className={className} aria-hidden="true" />;
  if (norm.includes("tailwind")) return <SiTailwindcss className={className} aria-hidden="true" />;
  if (norm.includes("hono")) return <SiHono className={className} aria-hidden="true" />;
  if (norm.includes("express")) return <SiExpress className={className} aria-hidden="true" />;
  if (norm.includes("fastify")) return <SiFastify className={className} aria-hidden="true" />;

  // Languages & Runtimes
  if (norm.includes("typescript") || norm === "ts") return <SiTypescript className={className} aria-hidden="true" />;
  if (norm.includes("javascript") || norm === "js") return <SiJavascript className={className} aria-hidden="true" />;
  if (norm.includes("node")) return <SiNodedotjs className={className} aria-hidden="true" />;
  if (norm.includes("bun")) return <SiBun className={className} aria-hidden="true" />;
  if (norm.includes("python")) return <SiPython className={className} aria-hidden="true" />;
  if (norm.includes("rust")) return <SiRust className={className} aria-hidden="true" />;
  if (norm.includes("go") || norm.includes("golang")) return <SiGo className={className} aria-hidden="true" />;
  if (norm.includes("java")) return <FaJava className={className} aria-hidden="true" />;
  if (norm.includes("android")) return <SiAndroid className={className} aria-hidden="true" />;

  // Databases & Infrastructure
  if (norm.includes("postgres")) return <SiPostgresql className={className} aria-hidden="true" />;
  if (norm.includes("redis")) return <SiRedis className={className} aria-hidden="true" />;
  if (norm.includes("mongo")) return <SiMongodb className={className} aria-hidden="true" />;
  if (norm.includes("mongoose")) return <SiMongoose className={className} aria-hidden="true" />;
  if (norm.includes("mysql")) return <SiMysql className={className} aria-hidden="true" />;
  if (norm.includes("prisma")) return <SiPrisma className={className} aria-hidden="true" />;
  if (norm.includes("supabase")) return <SiSupabase className={className} aria-hidden="true" />;
  if (norm.includes("firebase")) return <SiFirebase className={className} aria-hidden="true" />;
  if (norm.includes("docker")) return <SiDocker className={className} aria-hidden="true" />;
  if (norm.includes("cloudflare")) return <SiCloudflare className={className} aria-hidden="true" />;
  if (norm.includes("vercel")) return <SiVercel className={className} aria-hidden="true" />;
  if (norm.includes("github")) return <SiGithub className={className} aria-hidden="true" />;
  if (norm.includes("graphql")) return <SiGraphql className={className} aria-hidden="true" />;

  // AI & Architecture Protocols
  if (norm.includes("mcp") || norm.includes("model context protocol")) {
    return <SiAnthropic className={className} aria-hidden="true" title="Model Context Protocol (MCP)" />;
  }

  // Web & Browser APIs / Specialized Packages
  if (norm.includes("file system") || norm.includes("filesystem") || norm.includes("storage")) {
    return <FolderSync className={className} aria-hidden="true" />;
  }
  if (norm.includes("indexeddb")) {
    return <Database className={className} aria-hidden="true" />;
  }
  if (norm.includes("bullmq") || norm.includes("queue")) {
    return <Workflow className={className} aria-hidden="true" />;
  }
  if (norm.includes("crypto") || norm.includes("security") || norm.includes("aes")) {
    return <ShieldCheck className={className} aria-hidden="true" />;
  }
  if (norm.includes("pdf")) {
    return <FileText className={className} aria-hidden="true" />;
  }

  // Default clean code symbol
  return <Code2 className={className} aria-hidden="true" />;
}
