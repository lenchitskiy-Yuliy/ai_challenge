package router

import (
	"context"
	"net/http"

	"go.uber.org/zap"
)

type Middleware func(http.Handler) http.Handler

type Router struct {
	mux    *http.ServeMux
	logger *zap.Logger
}

func NewRouter(logger *zap.Logger) *Router {
	return &Router{mux: http.NewServeMux(), logger: logger}
}

// ServeHTTP implements http.Handler
func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	ctx := context.WithValue(req.Context(), http.ServerContextKey, w)
	r.mux.ServeHTTP(w, req.WithContext(ctx))
}

func (r *Router) Handle(pattern string, h http.Handler) {
	r.mux.Handle(pattern, h)
}

func (r *Router) Post(path string, h http.Handler, mws ...Middleware) {
	r.registerWithMethod("POST", path, h, mws...)
}

func (r *Router) Get(path string, h http.Handler, mws ...Middleware) {
	r.registerWithMethod("GET", path, h, mws...)
}

func (r *Router) registerWithMethod(method, path string, h http.Handler, mws ...Middleware) {
	var final http.Handler = h
	for i := len(mws) - 1; i >= 0; i-- {
		final = mws[i](final)
	}
	r.mux.Handle(path, methodOnly(method, final))
}

func methodOnly(verb string, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		if r.Method != verb {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		h.ServeHTTP(w, r)
	})
}

func prepareHandle(verb string, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		if r.Method != verb {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		h.ServeHTTP(w, r)
	})
}
