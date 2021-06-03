import type { Slice, PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { PodMeta } from "app/store/pod/types";
import type { Pod, PodState } from "app/store/pod/types";
import { TokenMeta } from "app/store/token/types";
import type { TokenState } from "app/store/token/types";
import {
  generateCommonReducers,
  generateStatusHandlers,
  genericInitialState,
} from "app/store/utils/slice";
import {
  token as tokenFactory,
  tokenState as tokenStateFactory,
  pod as podFactory,
  podState as podStateFactory,
  podStatus as podStatusFactory,
} from "testing/factories";

describe("slice", () => {
  describe("base reducers", () => {
    let slice: Slice;

    beforeEach(() => {
      slice = createSlice({
        name: TokenMeta.MODEL,
        initialState: genericInitialState as TokenState,
        reducers: generateCommonReducers<TokenState, TokenMeta.PK, void, void>(
          TokenMeta.MODEL,
          TokenMeta.PK
        ),
      });
    });

    it("returns the initial state", () => {
      expect(slice.reducer(undefined, { type: "" })).toEqual({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces fetchStart", () => {
      expect(slice.reducer(undefined, slice.actions.fetchStart(null))).toEqual({
        errors: null,
        items: [],
        loaded: false,
        loading: true,
        saved: false,
        saving: false,
      });
    });

    it("reduces fetchSuccess", () => {
      const tokens = [tokenFactory()];
      const tokenState = tokenStateFactory({
        items: [],
        loading: true,
      });
      expect(
        slice.reducer(tokenState, slice.actions.fetchSuccess(tokens))
      ).toEqual({
        errors: null,
        loading: false,
        loaded: true,
        saved: false,
        saving: false,
        items: tokens,
      });
    });

    it("reduces fetchError", () => {
      const tokenState = tokenStateFactory();
      expect(
        slice.reducer(
          tokenState,
          slice.actions.fetchError("Could not fetch tokens")
        )
      ).toEqual({
        errors: "Could not fetch tokens",
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces createStart", () => {
      const tokenState = tokenStateFactory({ saved: true });
      expect(
        slice.reducer(tokenState, slice.actions.createStart(null))
      ).toEqual({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true,
      });
    });

    it("reduces createError", () => {
      const tokenState = tokenStateFactory();
      expect(
        slice.reducer(
          tokenState,
          slice.actions.createError({ name: "Token name already exists" })
        )
      ).toEqual({
        errors: { name: "Token name already exists" },
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces createNotify", () => {
      const tokens = [tokenFactory({ id: 1 })];
      const newToken = tokenFactory({ id: 2 });
      const tokenState = tokenStateFactory({
        items: tokens,
      });

      expect(
        slice.reducer(tokenState, slice.actions.createNotify(newToken))
      ).toEqual({
        errors: null,
        items: [...tokens, newToken],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces updateStart", () => {
      const tokenState = tokenStateFactory({ saved: true });
      expect(
        slice.reducer(tokenState, slice.actions.updateStart(null))
      ).toEqual({
        errors: null,
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: true,
      });
    });

    it("reduces updateError", () => {
      const tokenState = tokenStateFactory();
      expect(
        slice.reducer(
          tokenState,
          slice.actions.updateError({ name: "Token name already exists" })
        )
      ).toEqual({
        errors: { name: "Token name already exists" },
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces updateNotify", () => {
      const newToken = tokenFactory({ id: 1, key: "new-key" });
      const tokenState = tokenStateFactory({
        items: [tokenFactory({ id: 1, key: "old-key" })],
      });
      expect(
        slice.reducer(tokenState, slice.actions.updateNotify(newToken))
      ).toEqual({
        errors: null,
        items: [newToken],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces deleteStart", () => {
      const tokens = [tokenFactory({ id: 1 })];
      const tokenState = tokenStateFactory({
        items: tokens,
      });
      expect(
        slice.reducer(tokenState, slice.actions.deleteStart(null))
      ).toEqual({
        errors: null,
        items: tokens,
        loaded: false,
        loading: false,
        saved: false,
        saving: true,
      });
    });

    it("reduces deleteSuccess", () => {
      const tokens = [tokenFactory({ id: 1 })];
      const tokenState = tokenStateFactory({
        items: tokens,
      });
      expect(
        slice.reducer(tokenState, slice.actions.deleteSuccess(null))
      ).toEqual({
        errors: null,
        items: tokens,
        loaded: false,
        loading: false,
        saved: true,
        saving: false,
      });
    });

    it("reduces deleteError", () => {
      const tokens = [tokenFactory({ id: 1 })];
      const tokenState = tokenStateFactory({
        items: tokens,
      });
      expect(
        slice.reducer(
          tokenState,
          slice.actions.deleteError("Token cannot be deleted")
        )
      ).toEqual({
        errors: "Token cannot be deleted",
        items: tokens,
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("reduces deleteNotify", () => {
      const tokens = [tokenFactory({ id: 1 }), tokenFactory({ id: 2 })];
      const tokenState = tokenStateFactory({
        items: tokens,
      });
      expect(slice.reducer(tokenState, slice.actions.deleteNotify(1))).toEqual({
        errors: null,
        items: [tokens[1]],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });
  });

  describe("additional reducers", () => {
    it("can reduce a custom reducer", () => {
      const slice = createSlice({
        name: TokenMeta.MODEL,
        initialState: genericInitialState as TokenState,
        reducers: {
          ...generateCommonReducers<TokenState, TokenMeta.PK, void, void>(
            TokenMeta.MODEL,
            TokenMeta.PK
          ),
          custom: (state: TokenState, _action: PayloadAction<undefined>) => {
            state.errors = "small potato";
          },
        },
      });

      const tokenState = tokenStateFactory();
      expect(slice.reducer(tokenState, slice.actions.custom())).toEqual({
        errors: "small potato",
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });

    it("can overwrite a base reducer", () => {
      const slice = createSlice({
        name: TokenMeta.MODEL,
        initialState: genericInitialState as TokenState,
        reducers: {
          ...generateCommonReducers<TokenState, TokenMeta.PK, void, void>(
            TokenMeta.MODEL,
            TokenMeta.PK
          ),
          fetchError: (state: TokenState, action: PayloadAction<string>) => {
            state.errors = `${action.payload} potato`;
          },
        },
      });
      const tokenState = tokenStateFactory();
      expect(
        slice.reducer(tokenState, slice.actions.fetchError("small"))
      ).toEqual({
        errors: "small potato",
        items: [],
        loaded: false,
        loading: false,
        saved: false,
        saving: false,
      });
    });
  });

  describe("base actions", () => {
    let slice: Slice;

    beforeEach(() => {
      slice = createSlice({
        name: TokenMeta.MODEL,
        initialState: genericInitialState as TokenState,
        reducers: generateCommonReducers<TokenState, TokenMeta.PK, void, void>(
          TokenMeta.MODEL,
          TokenMeta.PK
        ),
      });
    });

    it("can create an action for fetching tokens", () => {
      expect(slice.actions.fetch(null)).toEqual({
        type: "token/fetch",
        meta: {
          model: TokenMeta.MODEL,
          method: "list",
        },
        payload: null,
      });
    });

    it("can create an action for creating a token", () => {
      expect(
        slice.actions.create({ name: "token1", description: "a token" })
      ).toEqual({
        type: "token/create",
        meta: {
          model: TokenMeta.MODEL,
          method: "create",
        },
        payload: {
          params: {
            name: "token1",
            description: "a token",
          },
        },
      });
    });

    it("can create an action for updating a token", () => {
      expect(
        slice.actions.update({ name: "token1", description: "a token" })
      ).toEqual({
        type: "token/update",
        meta: {
          model: TokenMeta.MODEL,
          method: "update",
        },
        payload: {
          params: {
            name: "token1",
            description: "a token",
          },
        },
      });
    });

    it("can create an action for deleting a token", () => {
      expect(slice.actions.delete(808)).toEqual({
        type: "token/delete",
        meta: {
          model: TokenMeta.MODEL,
          method: "delete",
        },
        payload: {
          params: {
            id: 808,
          },
        },
      });
    });
  });

  describe("status reducers", () => {
    let slice: Slice;

    beforeEach(() => {
      const statusHandlers = generateStatusHandlers<PodState, Pod, PodMeta.PK>(
        PodMeta.PK,
        [
          {
            status: "refresh",
            statusKey: "refreshing",
            success: (state, action) => {
              for (const i in state.items) {
                if (state.items[i].id === action.payload.id) {
                  state.items[i] = action.payload;
                  return;
                }
              }
            },
          },
        ]
      );
      slice = createSlice({
        name: PodMeta.MODEL,
        initialState: {
          ...genericInitialState,
          active: null,
          projects: {},
          statuses: {},
        } as PodState,
        reducers: {
          ...generateCommonReducers<PodState, PodMeta.PK, void, void>(
            PodMeta.MODEL,
            PodMeta.PK
          ),
          refreshStart: statusHandlers.refresh.start,
          refreshSuccess: statusHandlers.refresh.success,
          refreshError: statusHandlers.refresh.error,
        },
      });
    });

    it("reduces the start action", () => {
      const pods = [podFactory({ id: 1 })];
      const podState = podStateFactory({
        items: pods,
        statuses: {
          1: podStatusFactory({ refreshing: false }),
        },
      });

      expect(
        slice.reducer(podState, slice.actions.refreshStart({ item: pods[0] }))
      ).toEqual(
        podStateFactory({
          items: pods,
          statuses: { 1: podStatusFactory({ refreshing: true }) },
        })
      );
    });

    it("reduces the success action", () => {
      const pods = [podFactory({ id: 1, cpu_speed: 100 })];
      const updatedPod = podFactory({ id: 1, cpu_speed: 100 });
      const podState = podStateFactory({
        items: pods,
        statuses: {
          1: podStatusFactory({ refreshing: true }),
        },
      });

      expect(
        slice.reducer(
          podState,
          slice.actions.refreshSuccess({ item: pods[0], payload: updatedPod })
        )
      ).toEqual(
        podStateFactory({
          items: [updatedPod],
          statuses: { 1: podStatusFactory({ refreshing: false }) },
        })
      );
    });

    it("reduces the error action", () => {
      const pods = [podFactory({ id: 1, cpu_speed: 100 })];
      const podState = podStateFactory({
        items: pods,
        statuses: {
          1: podStatusFactory({ refreshing: true }),
        },
      });

      expect(
        slice.reducer(
          podState,
          slice.actions.refreshError({
            item: pods[0],
            payload: "You dun goofed",
          })
        )
      ).toEqual(
        podStateFactory({
          errors: "You dun goofed",
          items: pods,
          statuses: { 1: podStatusFactory({ refreshing: false }) },
        })
      );
    });
  });
});
