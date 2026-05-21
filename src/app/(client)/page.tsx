"use client";

import { useApp } from "@/components/shared/Providers";
import HeroSection from "@/components/home/HeroSection";
import { useEffect, useState } from "react";
import { getPublishedProjects, getPublishedCertificates } from "@/lib/supabase/queries";
import type { Project, Certificate } from "@/types";

export default function HomePage() {
  const { lang } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [certs, setCerts]       = useState<Certificate[]>([]);

  useEffect(() => {
    getPublishedProjects().then(setProjects);
    getPublishedCertificates().then(setCerts);
  }, []);

  return <HeroSection lang={lang} projects={projects} certs={certs} />;
}