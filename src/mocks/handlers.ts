import { rest } from "msw";
import decode from "jwt-decode";
import encode from "jwt-encode";
import { type RestRequest } from "msw";

interface TokenData {
  id: number;
}

interface User {
  id: number;
  name: string;
}

export const createSessionToken = (user: User): string => {
  const tokenData: TokenData = { id: user.id };
  const token = encode(tokenData, "secret");
  return token;
};

export const readSessionToken = (token: string): TokenData => {
  return decode<TokenData>(token);
};

const getSessionToken = (req: RestRequest): string | null => {
  const header =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (!header) {
    return null;
  }

  return header.split("Bearer ")[1];
};

export const getSession = (req: RestRequest): TokenData | null => {
  const token = getSessionToken(req);

  if (!token) {
    return null;
  }

  return decode<TokenData>(token);
};

const sessionGet = rest.get("/api/v1/sessions", (req, res, ctx) => {
  const session = getSession(req);
  console.log("--", session, "--");

  if (!session) {
    return res(
      ctx.status(401),
      ctx.json({
        errors: [{ error: "Unauthorized" }],
      })
    );
  }

  return res(
    ctx.status(200),
    ctx.json({
      token: getSessionToken(req),
      user: { id: 1, name: "kyle davis" },
    })
  );
});

interface PostBody {
  email: string;
  password: string;
}
const sessionPost = rest.post<PostBody>(
  "/api/v1/sessions",
  async (req, res, ctx) => {
    const { email, password } = req.body;
    const token = createSessionToken({ id: 1, name: "kyle davis" });
    return res(
      ctx.status(201),
      ctx.json({
        token,
        user: {
          email,
          password,
          id: 1,
          name: "kyle davis",
        },
      })
    );
  }
);

export const handlers = [sessionGet, sessionPost];
