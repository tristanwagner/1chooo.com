import AnimatedSection from "@/components/animated-section";
import PageHeader from "@/components/page-header";
import CodingStats from "@/components/about/coding-stats";
import { LatestArticles } from "@/components/about/latest-articles";
import TalkToHugo from "@/components/about/talk-to-hugo";

import markdownToHtml from "@/lib/markdownToHtml";
import { getAllPosts } from "@/lib/api";

import config from "@/config";

import { cn } from "@workspace/ui/lib/utils";

import "react-loading-skeleton/dist/skeleton.css";
import "@/styles/markdown-styles.css";

const { about } = config;
const {
  firstName,
  lastName,
  preferredName,
  introduction,
  techStacks,
  githubUsername,
} = about;

async function About() {
  const allPosts = getAllPosts();

  let header = preferredName
    ? `About ${preferredName} 👨🏻‍💻`
    : `About ${firstName} ${lastName} 👨🏻‍💻`;

  const processedIntroduction = introduction
    ? await markdownToHtml(introduction)
    : null;

  return (
    <article>
      <AnimatedSection id="about">
        <PageHeader header={header} />
      </AnimatedSection>
      <AnimatedSection>
        {processedIntroduction && (
          <div
            className={cn("markdown")}
            dangerouslySetInnerHTML={{ __html: processedIntroduction }}
          />
        )}
      </AnimatedSection>
      {allPosts.length > 0 && <LatestArticles posts={allPosts} />}
      <CodingStats techStacks={techStacks} githubUsername={githubUsername} />
      <TalkToHugo />
    </article>
  );
}

export default About;
