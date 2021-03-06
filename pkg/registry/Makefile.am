registry_VIEWS = \
	pkg/registry/views/dashboard-page.html \
	pkg/registry/views/images-page.html \
	pkg/registry/views/projects-page.html \
	pkg/registry/views/example-dialog.html \
	$(NULL)

registry_LESS = \
	pkg/registry/styles/main.less \
	pkg/registry/styles/images.less \
	pkg/registry/styles/sidebar.less \
	$(NULL)

registry_MODULES = \
	pkg/registry/scripts/dashboard.js \
	pkg/registry/scripts/dialog.js \
	pkg/registry/scripts/exceptions.js \
	pkg/registry/scripts/images.js \
	pkg/registry/scripts/kube-client.js \
	pkg/registry/scripts/kube-client-cockpit.js \
	pkg/registry/scripts/projects.js \
	pkg/registry/scripts/main.js \
	pkg/registry/scripts/listing.js \
	$(NULL)

registry_BOWER = \
	pkg/registry/bower_components/less/dist/less.js \
	pkg/registry/bower_components/patternfly/less/variables.less \
	$(NULL)

registry_TESTS = \
	pkg/registry/tests/test-kube-client.html \
	$(NULL)

# Typically only modify stuff above this line

registrydir = $(pkgdatadir)/registry
nodist_registry_DATA = \
	pkg/registry/index.min.html.gz \
	pkg/registry/bundle.min.js.gz \
	pkg/registry/bundle.min.css.gz \
	$(NULL)
registry_DATA = \
 	pkg/registry/manifest.json \
	$(NULL)

registrydebugdir = $(debugdir)$(registrydir)
registrydebug_DATA = \
	pkg/registry/bundle.js \
	pkg/registry/bundle.css \
	pkg/registry/index.html \
	pkg/registry/override.json \
	$(NULL)

install-data-hook::
	mkdir -p $(DESTDIR)$(registrydebugdir)
	tar -cf - -C $(srcdir) $(registry_VIEWS) $(registry_LESS) $(registry_MODULES) $(registry_BOWER) | tar -xf - --strip-components=2 -C $(DESTDIR)$(registrydebugdir)

uninstall-hook:
	rm -rf $(DESTDIR)$(registrydebugdir)/scripts
	rm -rf $(DESTDIR)$(registrydebugdir)/views
	rm -rf $(DESTDIR)$(registrydebugdir)/styles
	rm -rf $(DESTDIR)$(registrydebugdir)/bower_components

registry_MIN = $(registry_MODULES:.js=.min.js)

registry_BUNDLE = \
	$(registry_MIN) \
	$(NULL)

# Bundles all the view templates into a $templateCache loadable
pkg/registry/templates.js: $(registry_VIEWS)
	$(AM_V_GEN) $(srcdir)/tools/missing $(srcdir)/tools/ngbundle -m registry -o $@ $^

# Everything else into a nice big bundle
pkg/registry/bundle.min.js: $(registry_BUNDLE) pkg/registry/templates.js
	$(AM_V_GEN) $(srcdir)/tools/missing $(srcdir)/tools/jsbundle $@ $^

# Less is compiled correctly
pkg/registry/bundle.min.css: $(registry_LESS)
	$(AM_V_GEN) $(srcdir)/tools/missing $(srcdir)/tools/lessc $< $@

TESTS += $(registry_TESTS)

CLEANFILES += \
	pkg/registry/registry.min.css \
	pkg/registry/index.min.html \
	pkg/registry/bundle.min.js \
	pkg/registry/templates.js \
	pkg/registry/bundle.min.css \
	$(registry_MIN) \
	$(nodist_registry_DATA) \
	$(NULL)

EXTRA_DIST += \
	pkg/registry/bundle.min.css \
	pkg/registry/index.min.html \
	pkg/registry/bundle.min.js \
	pkg/registry/templates.js \
	pkg/registry/scripts/kube-client-mock.js \
	pkg/registry/tests/fixture-basic.js \
	pkg/registry/tests/fixture-large.js \
	$(registry_BOWER) \
	$(registry_LESS) \
	$(registry_BUNDLE) \
	$(registry_MODULES) \
	$(registry_DATA) \
	$(registrydebug_DATA) \
	$(registry_TESTS) \
	$(registry_VIEWS) \
	$(NULL)

update-lib:: update-bower
	@true
