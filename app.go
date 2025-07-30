package main

import (
	"context"
	"fmt"
	"os"
)

// App struct
type App struct {
	ctx         context.Context
	startupArgs []string
}

// NewApp creates a new App application struct
func NewApp(args []string) *App {
	return &App{
		startupArgs: args,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello, %s !", name)
}

func (a *App) Open() string {
	println("Opening file:", a.startupArgs[1])
	file, err := os.ReadFile(a.startupArgs[1])
	if err != nil {
		panic(err)
	}
	return string(file)
}

func (a *App) Save(content string) {
	err := os.WriteFile(a.startupArgs[1], []byte(content), 0644)
	if err != nil {
		panic(err)
	}
	println("File saved successfully:", a.startupArgs[1])
}
