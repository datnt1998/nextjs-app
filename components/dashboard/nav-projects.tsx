"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icons } from "@/components/icons/registry";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface Project {
  name: string;
  url: string;
  icon: keyof typeof Icons;
}

interface NavProjectsProps {
  projects: readonly Project[];
}

export function NavProjects({ projects }: NavProjectsProps) {
  const { isMobile } = useSidebar();
  const [activeProject, setActiveProject] = useState(projects[0]);
  const t = useTranslations("navigation.projects");

  // Helper to translate project names
  const translateProjectName = (name: string): string => {
    const nameMap: Record<string, string> = {
      "Main Workspace": t("mainWorkspace"),
      "Team Alpha": t("teamAlpha"),
      "Team Beta": t("teamBeta"),
    };
    return nameMap[name] || name;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {(() => {
                  const Icon = Icons[activeProject.icon] || Icons.grid;
                  return <Icon className="size-4" />;
                })()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {translateProjectName(activeProject.name)}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {t("enterprise")}
                </span>
              </div>
              <ChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t("label")}
            </DropdownMenuLabel>
            {projects.map((project, _index) => {
              const Icon = Icons[project.icon] || Icons.grid;
              return (
                <DropdownMenuItem
                  key={project.name}
                  onClick={() => setActiveProject(project)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Icon className="size-4 shrink-0" />
                  </div>
                  {translateProjectName(project.name)}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                {t("addWorkspace")}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
