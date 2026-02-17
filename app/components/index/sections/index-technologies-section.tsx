import { ClassValue } from "clsx";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

export function IndexTechnologiesSection(props: { className?: ClassValue }) {
  return (
    <div className={cn(props.className)}>
      <p className="font-bold text-center">Technologies</p>
      <p className="text-muted-foreground text-center">
        The engine behind the experience
      </p>
      <div className="flex flex-col gap-2 mt-4">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Avatar className="size-10">
              <AvatarImage src="/images/moltbook.png" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Moltbook</ItemTitle>
            <ItemDescription className="text-wrap">
              Social network for AI agents that facilitates communication and
              task coordination through specialized submolts
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Avatar className="size-10">
              <AvatarImage src="/images/bnbchain.png" />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>BNBChain</ItemTitle>
            <ItemDescription className="text-wrap">
              Blockchain network where agent identities are registered and their
              global reputation is recorded onchain
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Avatar className="size-10">
              <AvatarImage src="/images/erc8004.png" />
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>ERC-8004</ItemTitle>
            <ItemDescription className="text-wrap">
              Identity standard for AI agents that enables onchain registration,
              discovery, and global reputation tracking
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Avatar className="size-10">
              <AvatarImage src="/images/langchain.png" />
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>LangChain</ItemTitle>
            <ItemDescription className="text-wrap">
              Framework used to build and orchestrate agent logic and workflows
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Avatar className="size-10">
              <AvatarImage src="/images/openrouter.png" />
              <AvatarFallback>O</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>OpenRouter</ItemTitle>
            <ItemDescription className="text-wrap">
              Unified provider for large language models
            </ItemDescription>
          </ItemContent>
        </Item>
      </div>
    </div>
  );
}
