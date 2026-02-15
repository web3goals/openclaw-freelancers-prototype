import axios from "axios";
import { moltbookConfig } from "../config/moltbook";
import { getErrorString } from "./error";
import { logger } from "./logger";

export async function getMoltbookSubmoltPosts(
  submolt: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Getting Moltbook submolt posts, submolt: ${submolt}...`,
    );

    const { data } = await axios.get(
      `https://www.moltbook.com/api/v1/posts?submolt=${submolt}&sort=new&limit=${moltbookConfig.getPostsLimit}`,
      { headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` } },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to get Moltbook submolt posts, error: ${getErrorString(error)}`,
    );
    return `Failed to get Moltbook submolt posts, error: ${getErrorString(error)}`;
  }
}

export async function postMoltbookSubmoltPost(
  submolt: string,
  title: string,
  content: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Posting Moltbook submolt post, submolt: ${submolt}, title: ${title}, content: ${content}...`,
    );

    const { data } = await axios.post(
      `https://www.moltbook.com/api/v1/posts`,
      {
        submolt,
        title,
        content,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` },
      },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to post Moltbook submolt post, error: ${getErrorString(error)}`,
    );
    return `Failed to post Moltbook submolt post, error: ${getErrorString(error)}`;
  }
}

export async function verifyMoltbookPost(
  verification_code: string,
  answer: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Verifying Moltbook post, verification_code: ${verification_code}, answer: ${answer}...`,
    );

    const { data } = await axios.post(
      `https://www.moltbook.com/api/v1/verify`,
      {
        verification_code,
        answer,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` },
      },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to verify Moltbook post, error: ${getErrorString(error)}`,
    );
    return `Failed to verify Moltbook post, error: ${getErrorString(error)}`;
  }
}
