import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";

const { updateUserMock } = vi.hoisted(() => ({
  updateUserMock: vi.fn(),
}));

vi.mock("../utils/apiHelper", () => ({
  loginUser: vi.fn(),
  refreshTokenUser: vi.fn(),
  registerUser: vi.fn(),
  updateUser: updateUserMock,
}));

vi.mock("../utils/tokenHelper", () => ({
  setToken: vi.fn(),
  deleteToken: vi.fn(),
  isTokenExpired: vi.fn(() => false),
  getTokenIfValid: vi.fn(() => null),
}));

const AuthConsumer = ({ onReady }: { onReady: (value: ReturnType<typeof useAuth>) => void }) => {
  const auth = useAuth();
  React.useEffect(() => {
    onReady(auth);
  }, [auth, onReady]);

  return null;
};

describe("AuthContext", () => {
  it("returns a controlled error when updating without an authenticated user", async () => {
    let contextValue: ReturnType<typeof useAuth> | null = null;

    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthConsumer onReady={(value) => { contextValue = value; }} />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => expect(contextValue).not.toBeNull());

    let result: { success: boolean; error?: string } | undefined;
    await act(async () => {
      result = await contextValue!.update({ firstName: "Test" });
    });

    expect(result).toEqual({
      success: false,
      error: "No authenticated user found for profile update",
    });
    expect(updateUserMock).not.toHaveBeenCalled();
  });
});
